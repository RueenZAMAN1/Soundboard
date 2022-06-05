import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator }  from '@react-navigation/stack'; 

import { ListScreen } from '../../screens/library/mysounds/ListScreen.js'
import { RecordScreen } from '../../screens/library/mysounds/RecordScreen.js'

const Stack = createStackNavigator();

//Component for "my sounds" tab navigation
export function MysoundsTab() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} options={{ title: 'My sounds' }}/>
        <Stack.Screen name="Record" component={RecordScreen} options={{ title: 'Create my sound' }}/>
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
