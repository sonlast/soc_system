import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import ReactNativePinView from 'react-native-pin-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUnlock, faDeleteLeft, faFingerprint } from '@fortawesome/free-solid-svg-icons';
import { useFonts, TitilliumWeb_400Regular } from '@expo-google-fonts/titillium-web';

const SignUpScreen = ({ navigation }) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  const handlePinComplete = async (pin) => {
    if (pin.length === 4) {
      await AsyncStorage.setItem('user_pin', pin);
      setAuthError('Authentication Set Successfully');
      setTimeout(() => {
        navigation.navigate('SemiApp');
      }, 1000)
    }
  };

  const handleFingerprintSetup = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Set up fingerprint',
    });
    if (result.success) {
      setAuthError('Authentication Set Successfully');
      setTimeout(() => {
        navigation.navigate('SemiApp');
      }, 1000)
    } else {
      setAuthError('Fingerprint Setup Failed');
    }
  };

  useEffect(() => {
    if (enteredPin.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (enteredPin.length === 4) {
      setShowCompletedButton(true);
    } else {
      setShowCompletedButton(false);
    }
  }, [enteredPin]);

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
        style={styles.gradient}
        start={[0.5, 0.5]}
      >
        <Text style={styles.title}>Set Up Authentication</Text>
        {isBiometricSupported && (
          <FontAwesomeIcon icon={faFingerprint} size={150} style={{ color: "#fff", marginBottom: 20 }} />
        )}
        {isBiometricSupported ? (
          <Pressable
            style={styles.fingerprintButton}
            onPress={handleFingerprintSetup}
          >
            <Text style={styles.fingerprintButtonText}>Authenticate</Text>
          </Pressable>
        ) : (
          <ReactNativePinView
            onComplete={handlePinComplete}
            ref={pinView}
            pinLength={4}
            inputSize={32}
            buttonSize={60}
            onValueChange={value => setEnteredPin(value)}
            buttonAreaStyle={styles.buttonArea}
            inputAreaStyle={styles.inputArea}
            inputViewEmptyStyle={styles.inputViewEmpty}
            inputViewFilledStyle={styles.inputViewFilled}
            buttonViewStyle={styles.buttonView}
            buttonTextStyle={styles.buttonText}
            onButtonPress={key => {
              if (key === "custom_left") {
                pinView.current.clear();
              } else if (key === "custom_right") {
                handlePinComplete(enteredPin, pinView.current.clear);
              }
            }}
            customLeftButton={showRemoveButton ? <FontAwesomeIcon icon={faDeleteLeft} size={48} color={"#000"} /> : undefined}
            customRightButton={showCompletedButton ? <FontAwesomeIcon icon={faUnlock} size={48} color={"#000"} /> : undefined}
          />
        )}
        {authError ? (
          <Text style={{ color: authError === 'Authentication Set Successfully ' ? '#00FF00' : 'red', marginTop: 20, fontFamily: 'TitilliumWeb_400Regular' }}>
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
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 50,
    fontFamily: 'TitilliumWeb_400Regular',
  },
  fingerprintButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  fingerprintButtonText: {
    fontFamily: 'TitilliumWeb_400Regular',
  },
  buttonArea: {
    marginTop: 24
  },
  inputArea: {
    marginBottom: 25
  },
  inputViewEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#fff'
  },
  inputViewFilled: {
    backgroundColor: '#fff'
  },
  buttonView: {
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: '#fff'
  },
  buttonText: {
    color: '#fff'
  },
});

export default SignUpScreen;
