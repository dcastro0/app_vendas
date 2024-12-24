import { router, useLocalSearchParams } from "expo-router";
import { TextInput } from "react-native-paper";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";

const ComandaNome = () => {
  const { valor } = useLocalSearchParams();

  return (
    <View style={tw`flex-1 justify-center items-center p-4 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>Nome da Comanda</Text>

      <TextInput
        label="Digite o nome da comanda"
        style={tw`w-full bg-white rounded-lg border border-gray-300 p-3 mb-6`}
      />

      <Pressable
        onPress={() => router.push({ pathname: "/(tabs)/comandas" })}
        style={tw`bg-blue-600 rounded-lg p-4 w-full items-center`}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Abrir Comanda</Text>
      </Pressable>
    </View>
  );
};

export default ComandaNome;
