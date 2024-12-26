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
import { RadioButton } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { PaymentSchema, PaymentFormData, PayMethodType } from "@/schema/schema";
import { usePaymentDb } from "@/database/usePayamentDb";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { showValueAlert, confirmacaoAlert } from "@/components/Alerts";
import { useRef } from "react";

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

  const pickerRef = useRef<Picker<PayMethodType> | null>(null);

  function open() {
    pickerRef.current?.focus();
  }

  function close() {
    pickerRef.current?.blur();
  }

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
  const comanda = () => {
    if (!value) {
      Alert.alert("Erro", "Insira um valor para abrir a comanda");
      return;
    }
    router.push({
      pathname: "/comanda/nome/[valor]",
      params: { valor: value },
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
        <Controller
          control={control}
          name="payMethod"
          render={({ field: { onChange, value } }) => (
            <View style={tw`w-full bg-slate-300 rounded-md`}>
              <Picker
                ref={pickerRef}
                style={tw`w-full text-blue-700`}
                dropdownIconColor={tw.color('blue-700')}
                dropdownIconRippleColor={tw.color('white')}
                itemStyle={tw`bg-blue-400 font-bold`}
                selectedValue={value}
                onValueChange={onChange}
              >
                <Picker.Item label="Dinheiro" value="Dinheiro" />
                <Picker.Item label="Cartão de Débito" value="Cartão de Débito" />
                <Picker.Item label="Cartão de Crédito" value="Cartão de Crédito" />
                <Picker.Item label="Pix" value="Pix" />
              </Picker>
            </View>

          )}
        />
        {errors.payMethod && (
          <Text style={tw`text-red-500 text-sm`}>{errors.payMethod.message}</Text>
        )}
        <Pressable onPress={value && payMethod === "Dinheiro" ? troco : handleSubmit(create)} style={tw`bg-green-500 p-3 rounded-md w-3/4`}>
          <Text style={tw`text-white text-center text-xl font-bold`}>Finalizar</Text>
        </Pressable>
        <Pressable onPress={comanda} style={tw`bg-sky-500 p-3 rounded-md w-3/4`}>
          <Text style={tw`text-white font-bold text-xl text-center`}>Abrir Comanda</Text>
        </Pressable>
      </View>
    </ScrollView >
  );
};

export default App;
