import { useComandaDb } from "@/database/useComandaDb"
import { PayMethodType } from "@/schema/schema"
import { router, useLocalSearchParams } from "expo-router"
import { useRef, useState, useEffect } from "react"
import { Alert, Pressable, ScrollView, Text, View } from "react-native"
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc'
import { TextInputMask } from "react-native-masked-text"

const MetodoPag = () => {
  const { id } = useLocalSearchParams()
  const comandaDb = useComandaDb()
  const comandaId = parseInt(id as string)
  const [payMethod, setPayMethod] = useState<PayMethodType>('Dinheiro')
  const [valorRecebido, setValorRecebido] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [troco, setTroco] = useState<number>(0)
  const [totalComanda, setTotalComanda] = useState<number>(0)
  const pickerRef = useRef<Picker<PayMethodType> | null>(null);

  function open() {
    pickerRef.current?.focus();
  }

  function close() {
    pickerRef.current?.blur();
  }

  useEffect(() => {
    const carregarComanda = async () => {
      try {
        const comanda = await comandaDb.getComandaById(comandaId);
        setTotalComanda(comanda.value);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o valor da comanda.");
      }
    }

    carregarComanda();
  }, [comandaId]);

  const calcularTroco = () => {
    const valorRecebidoFloat = parseFloat(valorRecebido.replace('R$', '').replace(".", "").replace(',', '.').trim());
    if (valorRecebidoFloat >= totalComanda) {
      setTroco(valorRecebidoFloat - totalComanda);
      setError('');
    } else {
      setTroco(0);
      setError('Valor recebido insuficiente.');
    }
  }

  const closeComanda = async () => {
    try {
      if (!payMethod) {
        Alert.alert("Método de pagamento não selecionado")
        return
      }
      if (payMethod === "Dinheiro" && !valorRecebido) {
        Alert.alert("Por favor, insira o valor recebido");
        return;
      }

      if (payMethod === "Dinheiro" && troco < 0) {
        Alert.alert("Erro", "O valor recebido é menor que o valor total.");
        return;
      }

      await comandaDb.closeComanda(comandaId, payMethod, troco);

      Alert.alert("Comanda fechada com sucesso");
      router.navigate("/(tabs)/comandas");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erro ao fechar comanda", error.message);
      } else {
        Alert.alert("Erro ao fechar comanda", "Erro desconhecido");
      }
    }
  }

  return (
    <ScrollView style={tw`flex-1`}>
      <View style={tw`flex justify-center items-center p-4 gap-10`}>
        <Text style={tw`text-2xl text-gray-600`}>Método de pagamento:</Text>
        <View style={tw`w-full bg-sky-400 rounded-md`}>
          <Picker
            ref={pickerRef}
            style={tw`w-full text-white`}
            dropdownIconColor={tw.color('white')}
            dropdownIconRippleColor={tw.color('white')}
            itemStyle={tw`bg-blue-400`}
            selectedValue={payMethod}
            onValueChange={(itemValue) => setPayMethod(itemValue as PayMethodType)}
          >
            <Picker.Item label="Dinheiro" value="Dinheiro" />
            <Picker.Item label="Cartão de Débito" value="Cartão de Débito" />
            <Picker.Item label="Cartão de Crédito" value="Cartão de Crédito" />
            <Picker.Item label="Pix" value="Pix" />
          </Picker>
        </View>

        {payMethod === "Dinheiro" && (
          <View style={tw`w-full flex items-center gap-4`}>
            <TextInputMask
              type="money"
              value={valorRecebido}
              onChangeText={(value) => {
                setValorRecebido(value);
                calcularTroco();
              }}
              style={tw`border border-gray-400 p-2 rounded-md text-8xl text-center w-full h-30`}
              placeholder="R$0,00"
              textAlign="right"
            />
            {error && <Text style={tw`text-red-500 text-sm`}>{error}</Text>}
            <Pressable onPress={calcularTroco} style={tw`bg-green-500 p-3 rounded-md mt-4 w-full`}>
              <Text style={tw`text-white text-xl font-bold text-center`}>Troco</Text>
            </Pressable>
            <Text style={tw`text-xl mt-2`}>Troco: R${troco.toFixed(2)}</Text>
          </View>
        )}

        <Pressable onPress={closeComanda} style={tw`bg-green-500 p-3 rounded-md mt-4 w-full`}>
          <Text style={tw`text-white text-xl font-bold text-center`}>Fechar comanda</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default MetodoPag
