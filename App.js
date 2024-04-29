import "react-native-gesture-handler";
import React, { useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { store } from "./src/redux/Store";
import  SplashScreen  from "./src/screens/index";
import { NavigationContainer } from "@react-navigation/native";
import { NavigationRef } from "./src/navigation/RouterService";
import { NativeBaseProvider } from "native-base";
import { StatusBar } from 'react-native';

export default function App() {
  const [gateLifted, setGateLifted] = useState(true);
  function onBeforeLift() {
    setTimeout(() => {
      setGateLifted(true);
    }, 2000);
  }
  // console.log("AAPPSTORE", store);
  return (
    <Provider store={store}>
        <NavigationContainer ref={NavigationRef}>
          <StatusBar hidden />
          { gateLifted ? <AppNavigator /> : <SplashScreen />}
        </NavigationContainer>
    </Provider>
  );
}