import React from "react";
import {
  View,
  Alert,
  Text,
  Keyboard,
  Pressable,
  ScrollView,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PaymentSchema, PaymentFormData } from "@/schema/schema";
import { usePaymentDb } from "@/database/usePayamentDb";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { showValueAlert, confirmacaoAlert } from "@/components/Alerts";

const ItemComanda = () => {
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
  const comanda = () => {
    if (!value) {
      Alert.alert("Erro", "Insira um valor para abrir a comanda");
      return;
    }
    router.push({
      pathname: "/(tabs)/comandas",
    });
    reset();
  }
  return (
    <ScrollView style={tw`flex-1 bg-slate-50`} onTouchStart={handleKeyboardDismiss}>
      <View style={tw`flex p-2 justify-center items-center gap-4`}>
        <Text style={tw`text-lg text-gray-500`} >Insira o valor:</Text>
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

        <Text style={tw`text-lg text-gray-500`}>Selecione o método de pagamento:</Text>

        {errors.payMethod && (
          <Text style={tw`text-red-500 text-sm`}>{errors.payMethod.message}</Text>
        )}
        <Pressable onPress={comanda} style={tw`bg-sky-500 p-3 rounded-md w-3/4`}>
          <Text style={tw`text-white font-bold text-xl text-center`}>Adicionar item</Text>
        </Pressable>
      </View>
    </ScrollView >
  );
};

export default ItemComanda;
