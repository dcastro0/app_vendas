import React from "react";
import { View, Alert, Text, Keyboard, Pressable, ScrollView } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useComandaDb } from "@/database/useComandaDb";
import tw from "twrnc";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ItemComandaSchema, ItemComandaType } from "@/schema/schemaComanda";

const ItemComanda = () => {

  const { id } = useLocalSearchParams();
  const comandaId = parseInt(id as string);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ItemComandaType>({
    resolver: zodResolver(ItemComandaSchema),
    defaultValues: {
      value: "",
      quantity: "",
      id_comanda: comandaId,
    },
  });


  const { addItemComanda } = useComandaDb();
  const router = useRouter();

  const value = watch("value");
  const quantity = watch("quantity");;


  const addItem = async (data: ItemComandaType) => {
    if (!value || !quantity) {
      Alert.alert("Erro", "Preencha todos os campos antes de adicionar o item.");
      return;
    }

    try {
      const response = await addItemComanda(data);

      if (response) {
        Alert.alert("Sucesso", "Item adicionado à comanda!");
        reset();
        router.replace({ pathname: "/comanda/[id]", params: { id: comandaId } });
      } else {
        Alert.alert("Erro", "Não foi possível adicionar o item. Tente novamente.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar o item. Tente novamente.");
    }
  };


  const handleKeyboardDismiss = () => {
    Keyboard.dismiss();
  };

  return (
    <ScrollView style={tw`flex-1 bg-slate-50`} onTouchStart={handleKeyboardDismiss}>
      <View style={tw`flex p-2 justify-center items-center gap-4`}>
        <Text style={tw`text-lg text-gray-500`}>Insira o valor:</Text>
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

        <Text style={tw`text-lg text-gray-500`}>Quantidade:</Text>
        <Controller
          control={control}
          name="quantity"
          render={({ field: { onChange, value } }) => (
            <TextInputMask
              type="only-numbers"
              value={value}
              onChangeText={onChange}
              style={tw`border border-gray-400 p-2 rounded-md text-4xl text-center w-9/10 h-15`}
              placeholder="Quantidade"
              textAlign="right"
              keyboardType="numeric"
            />
          )}
        />
        {errors.quantity && (
          <Text style={tw`text-red-500 text-sm`}>{errors.quantity.message}</Text>
        )}

        <Pressable onPress={handleSubmit(addItem)} style={tw`bg-sky-500 p-3 rounded-md w-3/4`}>
          <Text style={tw`text-white font-bold text-xl text-center`}>Adicionar item</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ItemComanda;
