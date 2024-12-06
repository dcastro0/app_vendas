import { usePaymentDb } from "@/database/usePayamentDb";
import { PaymentFormData } from "@/schema/schema";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { FlatList, Text, View } from "react-native";

const Lista = () => {
  const [show, setShow] = useState<PaymentFormData[]>([]);
  const paymentDb = usePaymentDb();
  async function getPayments() {
    const response = await paymentDb.getPayments();
    setShow(response as PaymentFormData[]);
  }
  useCallback(async () => {
    await getPayments();
  }, [getPayments])
  return (
    <>
      <FlatList
        refreshControl={<RefreshControl refreshing={false} onRefresh={getPayments} />}
        data={[...show].reverse()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, width: "100%" }} key={item.id}>
            <Text>{item.id}</Text>
            <Text>{item.value}</Text>
            <Text>{item.payMethod}</Text>
            <Text>{item.createdAt}</Text>
          </View>
        )}
      />
    </>

  )
}

export default Lista;