import React, { useEffect, useState } from 'react'
import { BackHandler, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const Calls = () => {
  const [profilePicture, setProfilePicture] = useState('');
  const auth = getAuth(app);
  const firestore = getFirestore(app);

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

  let [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular,
    TitilliumWeb_600SemiBold,
  });

  const navigation = useNavigation();

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.openDrawer();
            }}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1,
              }, {
                borderRadius: 50,
                borderWidth: 2.5,
                borderColor: 'hsl(0, 0%, 100%)',
              }
            ]}
          >
            <Avatar
              size={48}
              rounded
              source={profilePicture ? { uri: profilePicture } : require('../assets/profilepic.jpg')}
            />
          </Pressable>
          <Text style={styles.textheader}>
            Safe-on-chat
          </Text>
        </View>
        <View style={{
          flex: 1,
          marginTop: 125,
        }}>
          <Text style={styles.temp_text}>No Conversations Found. </Text>
          <Text style={styles.temp_text}>Start a New Chat.</Text>
        </View>
      </View>
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
    paddingTop: 40,
    paddingBottom: 0,
    padding: 10,
  },
  textheader: {
    fontFamily: 'TitilliumWeb_400Regular',
    fontSize: 25,
    color: 'hsl(0, 0%, 100%)',
    // marginTop: 6,
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
  }
})

export default Calls;