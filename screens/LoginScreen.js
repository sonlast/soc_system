import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Pressable, Text, TextInput, View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from '../firebaseConfig';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  const pressLogin = () => {
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        AsyncStorage.setItem("lastemail", email);
        Alert.alert("Quick Aid", "Login successful.");
        navigation.navigate("SemiApp");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (errorCode) {
          case "auth/invalid-login-credentials":
            Alert.alert("Quick Aid", "Account doesn't exist.");
            break;
          case "auth/invalid-credential":
            Alert.alert("Quick Aid", "Invalid credentials.");
            break;
          case "auth/user-not-found":
            Alert.alert("Quick Aid", "Account doesn't exist.");
            break;
          case "auth/invalid-email":
            Alert.alert(
              "Quick Aid",
              "Invalid email address. Please provide a valid email."
            );
            break;
          case "auth/weak-password":
            Alert.alert(
              "Quick Aid",
              "Password is too weak. Please provide a stronger password."
            );
            break;
          case "auth/wrong-password":
            Alert.alert("Quick Aid", "Incorrect password.");
            break;
          case "auth/missing-password":
            Alert.alert("Quick Aid", "Please provide a password.");
            break;
          case "auth/too-many-requests":
            Alert.alert(
              "Quick Aid",
              "Too many requests. Please try again later."
            );
            break;
          default:
            Alert.alert(
              "Quick Aid",
              `Account creation error: ${errorMessage} (Error Code: ${errorCode})`
            );
            break;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };


  let [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular,
    TitilliumWeb_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
      <KeyboardAvoidingView
      style={styles.container}
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <LinearGradient
          colors={['#4c669f', '#f0ceff']}
          style={
            styles.linearg
          }
          start={[0.5, 0.5]}
        >
          <Image
            style={styles.logo}
            source={require('../assets/soclogo.png')}
          />
          <TextInput
            placeholderTextColor={'rgb(200, 200, 200)'}
            placeholder='Email'
            autoCapitalize='none'
            style={styles.input}
            autoFocus={true}
            inputMode='email'
            value={email}
            onChangeText={(text) => {
              console.log("Typing email...");
              setEmail(text);
            }}
          />
          <TextInput
            placeholderTextColor={'rgb(220, 220, 220)'}
            placeholder='Password'
            autoCapitalize='none'
            style={styles.input}
            secureTextEntry={true}
            contextMenuHidden={true}
            value={password}
            onChangeText={(text) => {
              console.log("Typing password...");
              setPassword(text);
            }}
          />
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? 'rgb(210, 230, 255)'
                  : 'rgb(255, 255, 255)',
              },
              styles.loginbutton
            ]}
            onPress={pressLogin}
          >
            <Text style={styles.logintext}>LOG IN</Text>
          </Pressable>
        </LinearGradient>
      </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  linearg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  input: {
    marginTop: 50,
    textAlign: 'center',
    width: 225,
    height: 50,
    backgroundColor: '#fff',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #000000',
    borderRadius: 10,
    fontFamily: 'TitilliumWeb_600SemiBold',
    fontSize: 15,
  },
  logo: {
    marginTop: 150,
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  loginbutton: {
    marginTop: 30,
    width: 175,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  logintext: {
    fontFamily: 'TitilliumWeb_600SemiBold',
    fontSize: 17.5,
  },
});

export default LoginScreen;