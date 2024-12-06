import TextWhite from "@/components/TextWhite";
import { usePaymentDb } from "@/database/usePayamentDb";
import { PaymentFormData } from "@/schema/schema";
import { styles } from "@/styles/styles";
import { useState, useEffect } from "react";
import { RefreshControl, FlatList, View } from "react-native";

const Lista = () => {
  const [show, setShow] = useState<PaymentFormData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const paymentDb = usePaymentDb();

  const getPayments = async () => {
    setRefreshing(true);
    const response = await paymentDb.getPayments();
    setShow(response as PaymentFormData[]);
    setRefreshing(false);
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getPayments} />}
        data={[...show].reverse()}
        keyExtractor={(item) => (item.id?.toString() ?? '')}
        renderItem={({ item }) => (
          <View style={styles.card} key={item.id}>
            <TextWhite text={item.id?.toLocaleString() || ''} size={18}>
              {item.id?.toLocaleString() || ''}
            </TextWhite>
            <TextWhite text={item.value} size={18}>{item.value}</TextWhite>
            <TextWhite text={item.payMethod} size={18}>{item.payMethod}</TextWhite>
            <TextWhite text={item.createdAt || ''} size={18}>{item.createdAt || ''}</TextWhite>
          </View>
        )}
      />
    </View>
  );
};

export default Lista;
