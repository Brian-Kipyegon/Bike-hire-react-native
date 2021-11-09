import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { LogBox } from 'react-native';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingPage from './screens/LandingPage';
import LoginScreen from './screens/loginscreen';
import RegisterScreen from './screens/registerscreen';
import HomeScreen from './screens/homescreen';

const getFont = () => {
  Font.loadAsync({
    'cocobiker': require('./fonts/cocobiker/CocoBiker Regular Trial.ttf')
  })
}

async function getFonts() {
  await Font.loadAsync({
    'cocobiker': require('./fonts/cocobiker/CocoBiker Regular Trial.ttf')
  });
}

const customFonts = {
  Montserrat: require("./fonts/cocobiker/CocoBiker Regular Trial.ttf"),
};

const StackNav = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);
  let [fontsLoaded, setFontsLoaded] = useState(false);

  return (
    <NavigationContainer>
      <StackNav.Navigator initialRouteName='LandingPage' screenOptions={{ headerShown: false }}>
        <StackNav.Screen name="LandingPage" component={LandingPage} />
        <StackNav.Screen name="LoginScreen" component={LoginScreen} />
        <StackNav.Screen name="RegisterScreen" component={RegisterScreen} />
        <StackNav.Screen name="HomeScreen" component={HomeScreen} />
      </StackNav.Navigator>
    </NavigationContainer>
  );
}

