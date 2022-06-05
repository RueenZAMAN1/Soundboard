import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { MysoundsTab } from "../../tabs/sounds/MysoundsTab.js";
import { FreesoundsTab } from "../../tabs/sounds/FreesoundsTab.js";
import { DefaultsoundsTab } from "../../tabs/sounds/DefaultsoundsTab.js";

const Tab = createBottomTabNavigator();

//Component for the sound library (contains a tab navigator)
export function LibraryScreen() {
  const customTabBarStyle = {
    activeTintColor: "black",
    inactiveTintColor: "gray",
    style: {
      backgroundColor: "white",
      paddingBottom: 20,
      paddingTop: 20,
      height: 65,
    },
    showLabel: false,
    style: {
      backgroundColor: "#f8f8f8",
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 5,
      height: 70,
    },
  };

  return (
    <Tab.Navigator
      tabBarOptions={customTabBarStyle}
      barStyle={{ backgroundColor: "lightgrey" }}
      options={{ headerStyle: { backgroundColor: "lightgrey" } }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "MySounds":
              iconName = focused ? "mic" : "mic-outline";
              break;
            case "FreeSounds":
              iconName = focused ? "radio" : "radio-outline";
              break;
            case "DefaultSounds":
              iconName = focused ? "musical-note" : "musical-note-outline";
              break;
            default:
              iconName = "ban";
              break;
          }

          return <Ionicons name={iconName} size={30} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="MySounds"
        component={MysoundsTab}
        options={{ tabBarLabel: "My sounds" }}
      />
      <Tab.Screen
        name="FreeSounds"
        component={FreesoundsTab}
        options={{ tabBarLabel: "FreeSounds" }}
      />
      <Tab.Screen
        name="DefaultSounds"
        component={DefaultsoundsTab}
        options={{ tabBarLabel: "Default" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
