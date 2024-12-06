import React, { useEffect } from "react";
import { Pressable, View, Alert, FlatList } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { RadioButton, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { styles } from "../../styles/styles";
import { PaymentSchema, PayMethodType, PaymentFormData } from "../../schema/schema";
import { usePaymentDb } from "@/database/usePayamentDb";


const App = () => {

  const { control, handleSubmit, formState: { errors }, reset } = useForm<PaymentFormData>({
    resolver: zodResolver(PaymentSchema),
  });

  const paymentDb = usePaymentDb();

  async function create(data: PaymentFormData) {
    confirmacaoAlert();
    const response = await paymentDb.insertPayment(data);
    showValueAlert(data, response.insertRowId);
  }
  const showValueAlert = (data: PaymentFormData, response: string) => {
    Alert.alert(
      "Dados Venda",
      `ID: ${response}\nValor: ${data.value}\nMétodo de pagamento: ${data.payMethod}\nData: ${new Date().toLocaleDateString()}\nHora: ${new Date().toLocaleTimeString()}`,
      [
        {
          text: "OK",
          onPress: () => reset()
        }
      ]
    )
  };
  const confirmacaoAlert = () => {
    Alert.alert(
      "Confirmação",
      "Deseja confirmar o pagamento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => {
            reset();
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text>Insira o valor:</Text>
      <Controller
        control={control}
        name="value"
        render={({ field: { onChange, value } }) => (
          <TextInputMask
            type="money"
            value={value}
            onChangeText={onChange}
            style={styles.input}
            placeholder="R$0,00"
            textAlign="right"
          />
        )}
      />
      {errors.value && <Text style={styles.error}>{errors.value.message}</Text>}

      <Text>Selecione o método de pagamento:</Text>
      <Controller
        control={control}
        name="payMethod"
        render={({ field: { onChange, value } }) => (
          <RadioButton.Group
            onValueChange={onChange}
            value={value}
          >
            <View style={styles.radioGroup}>
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
      {errors.payMethod && <Text style={styles.error}>{errors.payMethod.message}</Text>}

      <Pressable style={styles.btn} onPress={handleSubmit(create)}>
        <Text style={{ color: "white", textAlign: "center", fontSize: 40 }}>Enviar</Text>
      </Pressable>
    </View>
  );
};



export default App;
