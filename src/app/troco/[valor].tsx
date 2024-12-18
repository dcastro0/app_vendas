import { showValueAlert, confirmacaoAlert } from "@/components/Alerts";
import Button from "@/components/Button";
import { usePaymentDb } from "@/database/usePayamentDb";
import { PaymentFormData } from "@/schema/schema";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, Text, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import tw from "twrnc";

const Troco = () => {
  const { valor } = useLocalSearchParams();
  const [valorRecebido, setValorRecebido] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [trocoCalculado, setTrocoCalculado] = useState<boolean>(false);
  const [troco, setTroco] = useState<number>(0);

  const data: PaymentFormData = {
    value: valor as string,
    payMethod: "dinheiro",
    troco: troco,
    total_pago: valorRecebido ? parseFloat(valorRecebido.replace('R$', '').replace(',', '.')) : 0,
  };
  const paymentDb = usePaymentDb();
  async function create(data: PaymentFormData) {
    confirmacaoAlert(() => create(data));
    try {
      if (!data.total_pago) {
        Alert.alert("Erro", "Informe o valor recebido.");
        return;
      }
      if (data.total_pago < parseFloat(data.value.replace('R$', '').replace(',', '.'))) {
        Alert.alert("Erro", "Valor recebido menor que o valor da compra.");
        return;
      }
      if (!trocoCalculado) {
        Alert.alert("Erro", "Calcule o troco antes de salvar.");
        return;
      }

      const response = await paymentDb.insertPayment(data);
      console.log(response);

      showValueAlert(data, response.insertRowId, router.back);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar os dados." + (error as Error).message
      );
    }
  }
  const handleValueChange = (value: string): number => {
    const parsedValue = parseFloat(value.replace('R$', '').replace(',', '.').trim());
    return parsedValue;
  };

  const calcularTroco = () => {
    const valorCompra = handleValueChange(valor as string);
    const valorRecebidoNum = handleValueChange(valorRecebido);
    if (valorRecebidoNum < valorCompra) {
      setTroco(0);
      setError("Valor recebido menor que o valor da compra");
      return;
    }
    setError("");
    setTroco(valorRecebidoNum - valorCompra);
    setTrocoCalculado(true);
  };

  return (
    <View style={tw`flex flex-col items-center justify-center gap-4 p-4`}>
      <Text>Valor Recebido</Text>
      <TextInputMask
        type="money"
        value={valorRecebido}
        onChangeText={setValorRecebido}
        style={tw`border border-gray-400 p-2 rounded-md text-8xl text-center w-9/10 h-30`}
        placeholder="R$0,00"
        textAlign="right"
      />
      {error && <Text style={tw`text-red-500 text-sm`}>{error}</Text>}
      <Button onPress={calcularTroco}>Calcular</Button>

      <View style={tw`flex flex-col items-center justify-center gap-4 p-4 rounded-md bg-red-600`}>

        <Text style={tw`text-white text-2xl font-bold`}>Troco: R$ {troco.toFixed(2).replace(".", ",")}</Text>
        <Text style={tw`text-white text-2xl font-bold`}>Valor Recebido: {valorRecebido}</Text>
        <Text style={tw`text-white text-2xl font-bold`}>Valor Compra: {valor}</Text>
      </View>
      <Button onPress={() => create(data)}>Enviar</Button>
    </View>
  );
};

export default Troco;
