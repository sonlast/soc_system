// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landingpage from './screens/Landingpage';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import FingerprintScreen from './screens/FingerprintScreen';
import HomeScreen from './screens/HomeScreen';
import ChatRoomScreen from './screens/ChatRoomScreen';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


const Stack = createNativeStackNavigator();
const uuid = uuidv4();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Land" component={Landingpage} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Fingerprint" component={FingerprintScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} option={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//? SAFE-on-Chat: A Messaging Application with Security Features using RSA and TwoFish Encryption Algorithm

//! FEATURES
//! Sending Attachments (other file types)
//! No SQL
//! Calls (Video/Audio)
//! Chatroom
//! Login / Registration Form
//! Other Security Features 
//! Can't Screenshot

//* Modify Algorithm