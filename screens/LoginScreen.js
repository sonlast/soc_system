import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

export default class LoginScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.background}
          >
        </LinearGradient>
        <Text style={styles.text}> textInComponent </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    color: '#333',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
});