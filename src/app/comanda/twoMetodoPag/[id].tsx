import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import tw from "twrnc";
import { PayMethodType } from "@/schema/schema";
import Select from "@/components/Select";
import { useComandaDb } from "@/database/useComandaDb";

const TwoMetodoPag = () => {
  const { id } = useLocalSearchParams();
  const comandaDb = useComandaDb();
  const comandaId = parseInt(id as string);

  const [valorRecebido, setValorRecebido] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [valorRecebido2, setValorRecebido2] = useState<string>('');
  const [error2, setError2] = useState<string>('');
  const [payMethod, setPayMethod] = useState<PayMethodType>('Dinheiro');
  const [payMethod2, setPayMethod2] = useState<PayMethodType>('Cartão de Crédito');
  const [totalComanda, setTotalComanda] = useState<number>(0);

  useEffect(() => {
    const carregarComanda = async () => {
      try {
        const comanda = await comandaDb.getComandaById(comandaId);
        setTotalComanda(comanda.value);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o valor da comanda.");
      }
    };
    carregarComanda();
  }, [comandaId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleValue = (value: string) => {
    const valueFloat = parseFloat(value.replace("R$", "").replace(".", "").replace(",", ".").trim());
    const resto = totalComanda - valueFloat;
    setValorRecebido(value);
    setValorRecebido2(formatCurrency(resto));
  };

  const closeComanda = async () => {
    try {
      if (!payMethod) {
        setError("Por favor, selecione o método de pagamento");
        Alert.alert("Erro ao fechar comanda", "Por favor, selecione o método de pagamento");
        return;
      }
      if (!valorRecebido) {
        setError("Por favor, informe o valor recebido");
        Alert.alert("Erro ao fechar comanda", "Por favor, informe o valor recebido");
        return;
      }
      if (!payMethod2) {
        setError2("Por favor, selecione o método de pagamento");
        Alert.alert("Erro ao fechar comanda", "Por favor, selecione o método de pagamento");
        return;
      }
      if (!valorRecebido2) {
        setError2("Por favor, informe o valor recebido");
        Alert.alert("Erro ao fechar comanda", "Por favor, informe o valor recebido");
        return;
      }
      if (payMethod2 === payMethod) {
        setError2("Os métodos de pagamento devem ser diferentes");
        Alert.alert("Erro ao fechar comanda", "Os métodos de pagamento devem ser diferentes");
        return;
      }
      await comandaDb.closeComandaTwoMethods(comandaId, payMethod, payMethod2, valorRecebido, valorRecebido2);

      Alert.alert("Comanda fechada com sucesso");
      router.navigate("/(tabs)/comandas");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erro ao fechar comanda", error.message);
      } else {
        Alert.alert("Erro ao fechar comanda", "Erro desconhecido");
      }
    } finally {
      setValorRecebido('');
      setValorRecebido2('');
      setError('');
      setError2('');
    }
  };

  return (
    <ScrollView style={tw`flex-1 p-4`}>
      <View style={tw`flex justify-center items-start`}>
        <Text style={tw`text-xl text-gray-500 ml-2 mb-4`}>Primeiro Método:</Text>
        <Select
          selectedValue={payMethod}
          onValueChange={(itemValue) => setPayMethod(itemValue as PayMethodType)}
        />
        <TextInputMask
          type="money"
          value={valorRecebido}
          onChangeText={handleValue}
          style={tw`p-2 rounded-md bg-white text-3xl text-center w-full h-14 mb-4`}
          placeholder="R$0,00"
          textAlign="right"
        />
        {error ? <Text style={tw`text-red-500`}>{error}</Text> : null}

        <Text style={tw`text-xl ml-2 mb-4 text-gray-500`}>Segundo Método:</Text>
        <Select
          selectedValue={payMethod2}
          onValueChange={(itemValue) => setPayMethod2(itemValue as PayMethodType)}
        />
        <TextInputMask
          type="money"
          value={valorRecebido2}
          onChangeText={setValorRecebido2}
          style={tw`p-2 rounded-md bg-white text-3xl text-center w-full h-14 mb-4`}
          placeholder="R$0,00"
          textAlign="right"
        />
        {error2 ? <Text style={tw`text-red-500`}>{error2}</Text> : null}

        <Pressable style={tw`bg-green-500 p-3 rounded-md mt-4 w-full`} onPress={closeComanda}>
          <Text style={tw`text-white font-bold text-xl text-center`}>Fechar Comanda</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default TwoMetodoPag;
