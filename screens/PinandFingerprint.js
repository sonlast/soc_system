import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { faFingerprint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFonts, TitilliumWeb_400Regular } from '@expo-google-fonts/titillium-web';

const AuthScreen = ({ navigation }) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleAuthentication = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || supported.length === 0 || !enrolled) {
      Alert.alert('Biometric authentication not supported or configured.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      fallbackLabel: 'Enter passcode',
    });

    if (result.success) {
      Alert.alert('Authentication successful!');
      // Navigate to the next screen
      navigation.navigate('SemiApp');
    } else {
      Alert.alert('Authentication failed.');
    }
  };

  let [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#f0ceff']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%', 
          ...styles.container
        }}
        start={[0.5, 0.5]}
      >
        <Text style={styles.title}>Authentication</Text>
        {isBiometricSupported ? (
        <FontAwesomeIcon icon={faFingerprint} size={100} style={{color: "#fff", marginBottom: 20}}/>
        ) : null}
        {isBiometricSupported ? (
          <Button title="Authenticate" onPress={handleAuthentication} />
        ) : (
          <Text>Biometric authentication is not supported on this device.</Text>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'TitilliumWeb_400Regular',
  },
});

export default AuthScreen;

// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as LocalAuthentication from 'expo-local-authentication';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

// const AuthScreen = ({ navigation }) => {
//   const [isBiometricSupported, setIsBiometricSupported] = useState(false);
//   const [showPinInput, setShowPinInput] = useState(false); // Step 1: State for showing PIN input
//   const [pin, setPin] = useState(''); // State for storing the entered PIN

//   useEffect(() => {
//     (async () => {
//       const compatible = await LocalAuthentication.hasHardwareAsync();
//       setIsBiometricSupported(compatible);
//       setShowPinInput(!compatible); // Automatically show PIN input if biometric is not supported
//     })();
//   }, []);

//   const handleAuthentication = async () => {
//     const hasHardware = await LocalAuthentication.hasHardwareAsync();
//     const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
//     const enrolled = await LocalAuthentication.isEnrolledAsync();

//     if (!hasHardware || supported.length === 0 || !enrolled) {
//       Alert.alert('Biometric authentication not supported or configured.');
//       setShowPinInput(true); // Show PIN input as a fallback
//       return;
//     }

//     const result = await LocalAuthentication.authenticateAsync({
//       promptMessage: 'Authenticate',
//       fallbackLabel: 'Enter passcode',
//     });

//     if (result.success) {
//       Alert.alert('Authentication successful!');
//       navigation.navigate('SemiApp');
//     } else {
//       Alert.alert('Authentication failed. Use PIN as a fallback.');
//       setShowPinInput(true); // Show PIN input as a fallback
//     }
//   };

//   const handlePinAuthentication = () => {
//     // Here, you should validate the entered PIN
//     // For demonstration, let's assume any PIN is correct
//     Alert.alert('PIN Authentication successful!');
//     navigation.navigate('SemiApp');
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#4c669f', '#f0ceff']}
//         style={{
//           position: 'absolute',
//           left: 0,
//           right: 0,
//           top: 0,
//           height: '100%', 
//           ...styles.container
//         }}
//         start={[0.5, 0.5]}
//       >
//         <Text style={styles.title}>Biometric Authentication</Text>
//         {isBiometricSupported ? (
//           <Button title="Authenticate" onPress={handleAuthentication} />
//         ) : (
//           showPinInput && (
//             <View>
//               <TextInput
//                 style={styles.pinInput}
//                 placeholder="Enter PIN"
//                 secureTextEntry
//                 onChangeText={setPin}
//                 value={pin}
//               />
//               <Button title="Login with PIN" onPress={handlePinAuthentication} />
//             </View>
//           )
//         )}
//       </LinearGradient>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   pinInput: {
//     marginVertical: 20,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     width: 200,
//     borderRadius: 5,
//   },
// });

// export default AuthScreen;