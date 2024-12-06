import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 20,
    marginTop: 50,
  },

  input: {
    borderWidth: 1,
    width: "90%",
    padding: 15,
    borderRadius: 10,
    fontSize: 72,
  },

  btn: {
    width: "40%",
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
  },

  radioGroup: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  error: {
    color: "red",
    fontSize: 14,
  }
});

export { styles };