import * as React from 'react';
import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Chats from './Chats';
import Calls from './Calls';
import SettingsScreen from './SettingsScreen';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation  } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const auth = getAuth();
  const navigator = useNavigation();

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ flex: 1 }}>
        <View style={styles.drawerHeader}>
          <Image
            style={styles.profilepic}
            source={require('../assets/profilepic.jpeg')}
          />
          <Text style={styles.drawerHeaderText}>Safe-on-chat</Text>
        </View>
        <DrawerItemList {...props} />
      </View>
      <Pressable
        style={{
          marginBottom: 20,
          paddingVertical: 15,
          paddingHorizontal: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}
        onPress={async () => {
          await signOut(auth);
          navigator.navigate("Land");
        }}
      >
        <Text style={{
          fontFamily: 'TitilliumWeb_400Regular',
          fontSize: 16,
          color: '#333',
        }}>Log Out</Text>
      </Pressable>
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
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 20,
          backgroundColor: '#4c669f',
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'TitilliumWeb_400Regular',
          fontSize: 15,
          color: ({ focused }) => (
            focused ? '#00ff' : '#000'
          )
        },
      }}
    >
      <Tab.Screen name="Chats" component={ChatsScreen} options={{
        headerShown: false,
        tabBarIcon: ({ focused, size }) => (
          <FontAwesomeIcon icon={faRocketchat} color={focused ? "#00ff" : "#000"} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Calls" component={CallsScreen} options={{
        headerShown: false, tabBarIcon: ({ focused, color, size }) => (
          <FontAwesomeIcon icon={faPhone} color={focused ? "#00ff" : "#000"} size={size} />
        ),
      }} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
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
