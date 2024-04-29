import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


/**
 * Local Imports
 */
import { LoginScreen, LoginOtpScreen } from '../screens/index';
import { StartDaySelectionScreen } from '../screens/Index';

export default function AuthScreens () {
    
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="LoginScreen" component={LoginScreen}/>
            <Stack.Screen name="LoginOtp" component={LoginOtpScreen}/>
        </Stack.Navigator>
    )
}