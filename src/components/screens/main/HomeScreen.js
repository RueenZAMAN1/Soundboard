import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";

//Component for main app interface
export function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Sampler")}>
        <View style={styles.button}>
          <Text> Sampler </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Library")}>
        <View style={styles.button}>
          <Text> Library </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <View style={styles.button}>
          <Text> Settings </Text>
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
