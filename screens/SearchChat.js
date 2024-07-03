import React, { useEffect, useState } from 'react'
import { BackHandler, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from '@rneui/themed';
import { Avatar } from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const Item = ({ user, onPress }) => (
  <Pressable onPress={() => onPress(user)}>
  <View style={styles.item}>
    <View style={{
      flexDirection: 'row',
      paddingVertical: 2.5,
      paddingHorizontal: 5,
    }}>
      <View>
        <Avatar size={48} rounded source={user.profilePicture ? { uri: user.profilePicture } : require('../assets/profilepic.jpg')} />
      </View>
      <View>
        <Text style={{
          fontFamily: 'TitilliumWeb_400Regular',
          fontSize: 20,
          paddingLeft: 10,
          paddingVertical: 10,
          textAlignVertical: 'center', 
        }}>{user.username}</Text>
      </View>
    </View>
  </View>
  </Pressable>
);

const SearchChat = () => {
  const [profilePicture, setProfilePicture] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const navigation = useNavigation();
  const [userInput, setUserInput] = useState('');

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(firestore, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfilePicture(userData.profilePicture || '')
        } else {
          console.log('No such document!');
        }
      }
    } catch (error) {
      console.error('Error fetching profile picture: ', error);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
    fetchUsers();
    const backAction = () => {
      navigation.navigate("Chats");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user => user.username.toLowerCase().includes(userInput.toLowerCase()))
    );
  }, [userInput, users]);

  const handleUserPress = (user) => {
    if (user.uid) {

      navigation.navigate('ChatScreen', {user, username: user.username, profilePicture: user.profilePicture, uid: user.uid});
    } else { 
      console.error('User does not have a valid UID');
    }
  };

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
        style={styles.linearGradient}
        start={[0.5, 0.5]}
      >
        <View style={styles.content}>
          <View styles={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 50,
          }}>
            <SearchBar
              round
              searchIcon={{ size: 24 }}
              placeholder="Search"
              onChangeText={(text) => setUserInput(text)}
              value={userInput}
              containerStyle={{
                backgroundColor: 'transparent',
                borderBottomWidth: 0,
                borderTopWidth: 0,
              }}
              inputStyle={{
                fontFamily: 'TitilliumWeb_400Regular',
              }}
              underlineColorAndroid={'transparent'}
            />
          </View>
          {filteredUsers.length === 0 ? (
            <View style={{
              flex: 1,
              marginTop: 125,
            }}>
              <Text style={styles.temp_text}>No Results Available. </Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredUsers}
              renderItem={({ item }) => <Item user={item} onPress={handleUserPress}/>}
              keyExtractor={item => item.id}
              style={{ marginTop: 10, paddingBottom: 10 }}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 0,
    padding: 10,
  },
  textheader: {
    fontFamily: 'TitilliumWeb_400Regular',
    fontSize: 25,
    color: 'hsl(0, 0%, 100%)',
    textAlignVertical: 'center',
    marginLeft: 10,
  },
  profilepic: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  header: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 10,
  },
  temp_text: {
    fontFamily: 'TitilliumWeb_600SemiBold',
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#f9c2ff',
    paddingLeft: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'TitilliumWeb_400Regular',
    paddingLeft: 10,
    textAlignVertical: 'center',
  },
  linearGradient: {
    flex: 1,
  }
})

export default SearchChat;