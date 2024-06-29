import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View, StyleSheet } from 'react-native';
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
  const [authError, setAuthError] = useState("");
  const [matched, setMatched] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!password.match(/[A-Z]/)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!password.match(/[a-z]/)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!password.match(/[0-9]/)) {
      errors.push("Password must contain at least one number.");
    }
    if (!password.match(/[\W_]/)) {
      errors.push("Password must contain at least one special character.");
    }
    return errors;
  };

  let [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular,
    TitilliumWeb_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const pressSignup = () => {
    const formattedUsername = username.startsWith('@') ? username : `@${username}`;
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Fill in the required fields.');
      setMatched('');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setMatched('');
      return;
    } else {
      setError('');
      setMatched('Passwords matched');
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      // Step 4: Provide Feedback
      setError(passwordErrors.join("\n"));
      return; // Stop the signup process if validation fails
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        const userDoc = doc(firestore, "users", user.uid);
        await setDoc(userDoc, {
          username: formattedUsername,
          email: email,
        });
        setAuthError("Account created successfully!");
        setTimeout(() => {
          navigation.navigate("SignUpAuth");
        }, 1000);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case "auth/invalid-email":
            setAuthError("Fill in the required fields.");
            break;
          case "auth/missing-password":
            setAuthError("Fill in your password.");
            break;
          case "auth/missing-email":
            setAuthError("Fill in your email address.");
            break;
          case "auth/weak-password":
            setAuthError("Password is too weak. It must be at least 6 characters long.");
            break;
          case "auth/email-already-in-use":
            setAuthError("The email address is already in use by another account.");
            break;
          default:
            Alert.alert(
              "SAFE-ON-CHAT",
              `Account creation error occurred. Please try again later. Error: ${errorMessage}`
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
        style={[
          styles.linearg,
        ]}
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
            autoFocus={true}
            inputMode="email"
            keyboardType="email-address"
            value={username}
            onChangeText={(text) => {
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
          {authError ? (
            <Text style={{
              color: authError.includes('Account created successfully!') ? '#00FF00' : 'red',
              marginTop: 20,
              fontFamily: 'TitilliumWeb_400Regular',
              textAlign: 'center',
            }}
            >
              {authError}
            </Text>
          ) : null}
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
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  linearg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  inputs: {
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
    color: '#ff0000',
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