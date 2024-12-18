import React from "react";
import {
  View,
  Alert,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { RadioButton } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PaymentSchema, PaymentFormData } from "@/schema/schema";
import { usePaymentDb } from "@/database/usePayamentDb";
import tw from "twrnc";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { showValueAlert, confirmacaoAlert } from "@/components/Alerts";

const App = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(PaymentSchema),
  });

  const paymentDb = usePaymentDb();
  const router = useRouter();

  const value = watch("value");
  const payMethod = watch("payMethod");

  async function create(data: PaymentFormData) {
    confirmacaoAlert(handleSubmit(create));
    try {
      const response = await paymentDb.insertPayment(data);
      showValueAlert(data, response.insertRowId, reset);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível salvar os dados." + (error as Error).message
      );
    }
  }

  const handleKeyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const troco = () => {
    router.push({
      pathname: "/troco/[valor]",
      params: { valor: value },
    });
    reset();
  }
  return (
    <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
      <View style={tw`flex p-6 justify-center items-center gap-6 mt-20`}>
        <Text>Insira o valor:</Text>
        <Controller
          control={control}
          name="value"
          render={({ field: { onChange, value } }) => (
            <TextInputMask
              type="money"
              value={value}
              onChangeText={onChange}
              style={tw`border border-gray-400 p-2 rounded-md text-8xl text-center w-9/10 h-30`}
              placeholder="R$0,00"
              textAlign="right"
            />
          )}
        />
        {errors.value && (
          <Text style={tw`text-red-500 text-sm`}>{errors.value.message}</Text>
        )}

        <Text>Selecione o método de pagamento:</Text>
        <Controller
          control={control}
          name="payMethod"
          render={({ field: { onChange, value } }) => (
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View style={tw`flex-row items-center`}>
                <RadioButton value="pix" />
                <Text>Pix</Text>

                <RadioButton value="dinheiro" />
                <Text>Dinheiro</Text>

                <RadioButton value="cartao" />
                <Text>Cartão</Text>
              </View>
            </RadioButton.Group>
          )}
        />
        {errors.payMethod && (
          <Text style={tw`text-red-500 text-sm`}>{errors.payMethod.message}</Text>
        )}
        <Button onPress={payMethod === "dinheiro" ? troco : handleSubmit(create)}>
          Enviar
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default App;
