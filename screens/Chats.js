import React, { useState, useCallback } from 'react'
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native'
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const Chats = () => {
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

  useFocusEffect(
    useCallback(() => {
      fetchProfilePicture();
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const navigation = useNavigation();

  let [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular,
    TitilliumWeb_600SemiBold,
  });


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
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 0,
            margin: 20,
            backgroundColor: '#4c669f',
            borderRadius: 50,
            padding: 20,
          }}
        >
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1,
              }
            ]}
            onPress={() => {
              navigation.navigate("SearchChat")
            }
            }>
            <FontAwesomeIcon icon={faPenToSquare} color="#f0ceff" size={25} style={{ alignContent: 'center' }} />
          </Pressable>
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
    paddingLeft: 10,
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
  //!  FOR THE FLATLIST
  item: {
    flexDirection: 'row',
    backgroundColor: '#f9c2ff',
    paddingLeft: 10,
    padding: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: 'TitilliumWeb_400Regular',
    paddingLeft: 10,
    textAlignVertical: 'center',
  },
  // image: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 40,
  // },
  // chat: {
  //   fontSize: 15,
  //   paddingLeft: 10,
  //   color: "#777",
  //   fontFamily: 'TitilliumWeb_600SemiBold',
  // },
  // imageContainer: {
  //   position: 'relative',
  // },
  // onlineIndicator: {
  //   position: 'absolute',
  //   right: 1, 
  //   top: 3, 
  //   width: 10, 
  //   height: 10,
  //   borderRadius: 7.5, 
  //   backgroundColor: '#00dd00',
  // },
})

export default Chats;