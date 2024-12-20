import React from "react";
import {
  View,
  Alert,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
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
              <View style={tw`flex flex-row flex-wrap gap-4`}>
                <Pressable
                  style={tw`flex flex-row gap-2 items-center justify-center p-1`}
                  onPress={onChange.bind(null, "Pix")}
                >
                  <RadioButton value="Pix" />
                  <Text style={tw`font-bold text-lg`}>Pix</Text>
                </Pressable>
                <Pressable
                  style={tw`flex flex-row gap-2 items-center justify-center p-1`}
                  onPress={onChange.bind(null, "Dinheiro")}
                >
                  <RadioButton value="Dinheiro" />
                  <Text style={tw`font-bold text-lg`}>Dinheiro</Text>
                </Pressable>
                <Pressable
                  style={tw`flex flex-row gap-2 items-center justify-center p-1 `}
                  onPress={onChange.bind(null, "Cartão de Crédito")}
                >
                  <RadioButton value="Cartão de Crédito" />
                  <Text style={tw`font-bold text-lg`}>Cartão de Crédito</Text>
                </Pressable>

                <Pressable
                  style={tw`flex flex-row gap-2 items-center justify-center p-1`}
                  onPress={onChange.bind(null, "Cartão de Débito")}
                >
                  <RadioButton value="Cartão de Débito" />
                  <Text style={tw`font-bold text-lg`}>Cartão de Débito</Text>
                </Pressable>


              </View>
            </RadioButton.Group>
          )}
        />
        {errors.payMethod && (
          <Text style={tw`text-red-500 text-sm`}>{errors.payMethod.message}</Text>
        )}
        <Button onPress={payMethod === "Dinheiro" ? troco : handleSubmit(create)}>
          Enviar
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default App;
