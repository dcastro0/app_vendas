import { PaymentFormData } from "@/schema/schema";
import { Alert } from "react-native";

const showValueAlert = (data: PaymentFormData, response: string, reset: any) => {
  Alert.alert(
    "Dados Venda",
    `ID: ${response}\nValor: ${data.value}\nMétodo de pagamento: ${data.payMethod}\nData: ${new Date().toLocaleDateString()}\nHora: ${new Date().toLocaleTimeString()}`,
    [
      {
        text: "OK",
        onPress: () => reset(),
      },
    ]
  );
};

const confirmacaoAlert = (subimit: any) => {
  Alert.alert("Confirmação", "Deseja confirmar o pagamento?", [
    {
      text: "Cancelar",
      style: "cancel",
    },
    {
      text: "Confirmar",
      onPress: () => subimit(),
    },
  ]);
};

export { showValueAlert, confirmacaoAlert };
