import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/**
 *  Local Imports
 */

import {
  DashBoardScreen
} from '../screens/index';

export default function UnAuthScreens() {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashBooard" component={DashBoardScreen} />
    </Stack.Navigator>
  )
}