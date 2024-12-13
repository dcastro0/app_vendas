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

const App = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(PaymentSchema),
  });

  const paymentDb = usePaymentDb();

  async function create(data: PaymentFormData) {
    confirmacaoAlert();
    try {
      const response = await paymentDb.insertPayment(data);
      console.log(response);

      showValueAlert(data, response.insertRowId);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar os dados." + (error as Error).message,
      );
    }
  }

  const showValueAlert = (data: PaymentFormData, response: string) => {
    Alert.alert(
      "Dados Venda",
      `ID: ${response}\nValor: ${data.value}\nMétodo de pagamento: ${data.payMethod}\nData: ${new Date().toLocaleDateString()}\nHora: ${new Date().toLocaleTimeString()}`,
      [
        {
          text: "OK",
          onPress: () => reset(),
        },
      ],
    );
  };

  const confirmacaoAlert = () => {
    Alert.alert("Confirmação", "Deseja confirmar o pagamento?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Confirmar",
        onPress: () => handleSubmit(create)(),
      },
    ]);
  };

  const handleKeyboardDismiss = () => {
    Keyboard.dismiss();
  };

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
              style={tw`border border-gray-400  p-2 rounded-md text-8xl text-center w-9/10 h-30`}
              placeholder="R$0,00"
              textAlign="right"
            />
          )}
        />
        {errors.value && (
          <Text style={tw`text-red-500 text-md`}>{errors.value.message}</Text>
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
          <Text style={tw`text-red-500 text-md`}>
            {errors.payMethod.message}
          </Text>
        )}

        <Button onPress={handleSubmit(create)}>Enviar</Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default App;
