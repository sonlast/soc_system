import React, { useState, useEffect, useRef} from 'react';
import { View, Text, Button, StyleSheet, Alert, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { faFingerprint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import PinView from 'react-native-pin-view';
import ReactNativePinView from 'react-native-pin-view';

const AuthScreen = ({ navigation }) => {
  const pinView = useRef(null);

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPinView, setShowPinView] = useState(false);
  
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      setShowPinView(!compatible);
      if (compatible) {
        const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (supported.length > 0 && enrolled) {
          handleAuthentication();
        }
      }
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
      setAuthError('Authentication successful');
      // Navigate to the next screen
      setTimeout(() => {

        navigation.navigate('SemiApp');
      }, 1000)
    } else {
      setAuthError('Authentication failed.');
    }
  };

  const handlePinComplete = (inputtedPin, clear) => {
    // Here, you should validate the entered PIN
    // For demonstration, let's assume any PIN is correct
    clear();
    setAuthError('Authentication successful');
    // Navigate to the next screen
    setTimeout(() => {
      navigation.navigate('SemiApp');
    }, 1000)
  }

  let [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular,
    TitilliumWeb_600SemiBold,
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
        <Text style={styles.title}>AUTHENTICATION</Text>
        {isBiometricSupported ? (
          <FontAwesomeIcon icon={faFingerprint} size={150} style={{ color: "#fff", marginBottom: 20 }} />
        ) : null}
        {isBiometricSupported ? (
          <Pressable
            style={{
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5,
              marginTop: 20,
            }}
            onPress={handleAuthentication}>
            <Text style={{
              fontFamily: 'TitilliumWeb_400Regular'
            }}>

              Authenticate
            </Text>
          </Pressable>
        ) : (
          <Text style={{ fontFamily: 'TitilliumWeb_400Regular', color: '#fff', fontSize: 15, }}>Biometric authentication is not supported on this device.</Text>
        )}
        {showPinView && (
          <ReactNativePinView
            ref={pinView}
            onComplete={(inputtedPin, clear) => handlePinComplete(inputtedPin, clear)}
            // onComplete={handlePinComplete}
            pinLength={4}
            buttonBgColor="#fff"
            buttonTextColor="#000"
            inputBgColor="#000"
            inputBgOpacity={0.10}
            inputActiveBgColor="#fff"
            inputBorderColor="#fff"
            inputActiveBorderColor="#fff"
            buttonDeletePosition="right"
            buttonDeleteBgColor="#fff"
            buttonDeleteTextColor="#000"
            buttonDeleteText="Delete"
            buttonDeleteTextFontSize={20}
            buttonDeleteTextFontFamily="TitilliumWeb_400Regular"
            buttonDeleteTextFontWeight="bold"
            buttonDeleteTextFontStyle="italic"
            buttonDeleteTextFontColor="#000"
            buttonDeleteTextFontVariant="small-caps"
          />
        )}
        {authError ? (
          <Text style={{ color: authError === 'Authentication successful' ? '#00FF00' : 'red', marginTop: 20, fontFamily: 'TitilliumWeb_400Regular' }}>
            {authError}
          </Text>
        ) : null}
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
    color: '#fff',
    marginBottom: 50,
    fontFamily: 'TitilliumWeb_600SemiBold',
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