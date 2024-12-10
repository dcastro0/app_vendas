import { usePaymentDb } from "@/database/usePayamentDb";
import { PaymentFormData } from "@/schema/schema";
import { styles } from "@/styles/styles";
import { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { RefreshControl, FlatList, View, Text, Pressable } from "react-native";
import tw from "twrnc";
import Button from "@/components/Button";
import ListRow from "@/components/ListRow";
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

  if (show.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={tw`text-2xl`}>Sem itens</Text>
        <Button onPress={getPayments}>Regarregar<Feather name="refresh-cw" size={24} color="white" /></Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getPayments} />}
        data={[...show].reverse()}
        keyExtractor={(item) => (item.id?.toString() ?? '')}
        renderItem={({ item }) => (
          <View style={styles.card} key={item.id}>
            <ListRow>{item.id}</ListRow>
            <ListRow>{item.value}</ListRow>
            <ListRow>{item.payMethod}</ListRow>
            <ListRow>{item.createdAt}</ListRow>
          </View>
        )}
      />
    </View>
  );
};

export default Lista;
