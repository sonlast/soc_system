import * as React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Chats from './Chats'; // Import your Chats component here
import Calls from './Calls'; // Import your Calls component here
import SettingsScreen from './FingerprintScreen'; // Import your SettingsScreen component here
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          style={styles.profilepic}
          source={require('../assets/profilepic.jpeg')}
        />
        <Text style={styles.drawerHeaderText}>Safe-on-chat</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const ChatsScreen = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#f0ceff']}
        style={styles.linearGradient}
        start={[0.5, 0.5]}
      >
        <Chats />
      </LinearGradient>
    </View>
  );
};

const CallsScreen = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#f0ceff']}
        style={styles.linearGradient}
        start={[0.5, 0.5]}
      >
        <Calls />
      </LinearGradient>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
      <DrawerNavigator />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilepic: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginRight: 10,
  },
  drawerHeaderText: {
    fontFamily: 'TitilliumWeb_400Regular',
    fontSize: 20,
    color: '#fff',
  },
});

export default App;
