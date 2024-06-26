import * as React from 'react';
import { Image, Pressable, Text, TextInput, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigate = useNavigation();

  pressLogin = () => {
    console.log('Login pressed');
    navigate.navigate('SemiApp');
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
          placeholder='Username'
          style={styles.input}
          autoFocus={true}
        />
        <TextInput
          placeholderTextColor={'rgb(220, 220, 220)'}
          placeholder='Password'
          style={styles.input}
          secureTextEntry={true}
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