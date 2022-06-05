import React from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { deleteAll } from "../../../../src/slices/SoundsSlice";

//Component for all type of settings
export function SettingsScreen() {
  const dispatch = useDispatch();

  const clear = () => {
    dispatch(deleteAll());
    alert("Your sounds were successfully deleted");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => clear()}>
        <View style={styles.button}>
          <Text> Delete my library </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242423",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    height: 40,
    width: 100,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
