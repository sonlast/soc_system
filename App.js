import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './screens/Loading';
import Landingpage from './screens/Landingpage';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SettingsScreen from './screens/SettingsScreen';
import SemiApp from './screens/SemiApp';
import PinandFingerPrint from './screens/PinandFingerprint';
import SignUpAuth from './screens/PinandFingerprintSignUp';
import SearchChat from './screens/SearchChat';
import ChatScreen from './screens/ChatScreen';
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const Stack = createNativeStackNavigator();
const uuid = uuidv4();

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular,
    TitilliumWeb_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Load"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4c669f',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'TitilliumWeb_400Regular',
        }
      }}
      >
        <Stack.Screen name="Load" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Land" component={Landingpage} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SemiApp" component={SemiApp} options={{ headerShown: false }} />
        <Stack.Screen name="PinandFingerprint" component={PinandFingerPrint} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpAuth" component={SignUpAuth} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: true }}/>
        <Stack.Screen name="SearchChat" component={SearchChat} options={{ title: 'Search Contacts' }}/>
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

//! TASKS for Tomorrow
//! - implement RSA / TwoFish Encryption
//! - navigation handling
//! - margin / padding top
//? - configure pin for global storage

// AGENDA
//! Red for Priority
//? Blue for Secondary