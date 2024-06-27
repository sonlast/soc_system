import React, { useState, useEffect } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import { useNavigation } from '@react-navigation/native';
import { app } from '../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [matched, setMatched] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // useEffect(() => {
  //   if (password && confirmPassword) {
  //     if (password === confirmPassword) {
  //       setError('');
  //       setMatched('Passwords matched');
  //     } else {
  //       setError('Passwords do not match');
  //       setMatched('');
  //     }
  //   } else {
  //     setError('');
  //     setMatched('');
  //   }
  // }, [password, confirmPassword]);
  let [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular,
    TitilliumWeb_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const pressSignup = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setMatched('');
      return;
    } else {
      setError('');
      setMatched('Passwords matched');
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        const userDoc = doc(firestore, "users", user.uid);
        await setDoc(userDoc, {
          username: username,
          email: email,
        });

        Alert.alert("Quick Aid", "Account created successfully!");
        navigation.navigate("Login", { username: username });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case "auth/invalid-email":
            Alert.alert("Quick Aid", "Fill in the required fields.");
            break;
          case "auth/missing-password":
            Alert.alert("Quick Aid", "Fill in your password.");
            break;
          case "auth/missing-email":
            Alert.alert("Quick Aid", "Fill in your email address.");
            break;
          case "auth/weak-password":
            Alert.alert("Quick Aid", "Password is too weak. It must be at least 6 characters long.");
            break;
          case "auth/email-already-in-use":
            Alert.alert(
              "Quick Aid",
              "The email address is already in use by another account."
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


  return (
    <View style={styles.container}>

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
        <View style={styles.inputs}>
          <TextInput
            placeholderTextColor={'rgb(200, 200, 200)'}
            placeholder='Username'
            style={[styles.input, { marginTop: 0 }]}
            autoCapitalize='none'
            autoFocus={false}
            inputMode="email"
            keyboardType="email-address"
            value={username}
            onChangeText={(text) => {
              console.log("Typing username...");
              setUsername(text);
            }}
          />
          <TextInput
            placeholderTextColor={'rgb(220, 220, 220)'}
            placeholder='Email'
            style={styles.input}
            autoCapitalize='none'
            inputMode="email"
            keyboardType="email-address"
            autoFocus={false}
            value={email}
            onChangeText={(text) => {
              console.log("Typing email...");
              setEmail(text);
            }}
          />
          <TextInput
            placeholderTextColor={'rgb(220, 220, 220)'}
            placeholder='Password'
            style={styles.input}
            autoCapitalize='none'
            secureTextEntry={true}
            maxLength={12}
            contextMenuHidden={true}
            value={password}
            onChangeText={(text) => {
              console.log("Typing password...");
              setPassword(text);
            }}
          />
          <TextInput
            placeholderTextColor={'rgb(220, 220, 220)'}
            placeholder='Confirm Password'
            style={styles.input}
            autoCapitalize='none'
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : <Text style={styles.matchedpass}>{matched}</Text>}
        </View>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? 'rgb(210, 230, 255)'
                : 'rgb(255, 255, 255)',
            },
            styles.signupbutton
          ]}
          onPress={pressSignup}
        >
          <Text style={styles.signuptext}>SIGN UP</Text>
        </Pressable>
      </LinearGradient>
    </View>
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
  inputs: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginTop: 25,
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
    marginTop: 80,
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  signupbutton: {
    marginTop: 30,
    width: 175,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  signuptext: {
    fontFamily: 'TitilliumWeb_600SemiBold',
    fontSize: 17.5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontFamily: 'TitilliumWeb_600SemiBold',
  },
  matchedpass: {
    color: '#00ff00',
    marginTop: 10,
    fontFamily: 'TitilliumWeb_600SemiBold',
  }
});

export default RegisterScreen;