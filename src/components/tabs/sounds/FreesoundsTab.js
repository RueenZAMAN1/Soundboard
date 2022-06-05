import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator }  from '@react-navigation/stack'; 

import { ListScreen } from '../../screens/library/freesounds/ListScreen.js'
import { SearchScreen } from '../../screens/library/freesounds/SearchScreen.js'

const Stack = createStackNavigator();

//Component for freesounds tab navigation
export function FreesoundsTab() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} options={{ title: 'Freesounds' }}/>
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search a sound' }}/>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
