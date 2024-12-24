import { router, useLocalSearchParams } from "expo-router";
import { TextInput } from "react-native-paper";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { useComandaDb } from "@/database/useComandaDb";
import { useState } from "react";

const ComandaNome = () => {

  const { valor } = useLocalSearchParams();
  const comandaDb = useComandaDb();
  const { createComanda, addItemComanda } = comandaDb;

  const [name, setName] = useState('');
  const [erro, setErro] = useState('');

  const value = parseFloat((valor as string).replace("R$", "").replace(",", ".").trim())

  const create = async () => {
    if (name.length === 0) {
      setErro("Nome da comanda é obrigatório");
      return;
    }
    try {
      const response = await createComanda(name);
      await addItemComanda({ id_comanda: response.lastInsertRowId, value: String(value), quantity: "1" });
      router.push({ pathname: "/(tabs)/comandas" });
    } catch (error) {
      console.error("Erro ao criar comanda:", error);
    }
  }

  return (
    <View style={tw`flex-1 justify-center items-center p-4 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>Nome da Comanda</Text>

      <TextInput
        label="Digite o nome da comanda"
        style={tw`w-full bg-white rounded-lg border border-gray-300 p-3 mb-6`}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      {erro && <Text style={tw`text-red-500 mb-4`}>{erro}</Text>}

      <Pressable
        onPress={create}
        style={tw`bg-blue-600 rounded-lg p-4 w-full items-center`}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Abrir Comanda</Text>
      </Pressable>
    </View>
  );
};

export default ComandaNome;
