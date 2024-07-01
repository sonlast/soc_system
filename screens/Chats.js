import React, { useEffect, useState, useCallback } from 'react'
import { BackHandler, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

//? OPTIONS --> faPen, faUserGroup, faPlus

//! DATA FOR FLATLIST
// const data = [
//   {
//     id: '1',
//     title: 'Aiah Arceta',
//     image: require('../assets/bini/aiah.jpg'),
//     text: 'Aiah: Rinig nyo po kami po?'
//   },
//   {
//     id: '2',
//     title: 'Colet Vergara',
//     image: require('../assets/bini/colet.jpg'),
//     text: 'Colet: Ba\'t mo natanong??'
//   },
//   {
//     id: '3',
//     title: 'Kylo Ren',
//     image: require('../assets/profilepic.jpg'),
//     text: 'You: Pass sa lowkey'
//   },
//   {
//     id: '4',
//     title: 'Maloi Ricalde',
//     image: require('../assets/bini/maloi.jpg'),
//     text: 'Maloi: Kabargas naman nyan ayy'
//   },
//   {
//     id: '5',
//     title: 'AJ Yape',
//     image: require('../assets/bini/aj.jpg'),
//     text: 'AJ sent you an image.'
//   },
//   {
//     id: '6',
//     title: 'Princess Torres',
//     image: require('../assets/bini/cess.jpg'),
//     text: 'Princess sent you an emoji. '
//   },
//   {
//     id: '7',
//     title: 'Gwen Apuli',
//     image: require('../assets/bini/gwen.jpg'),
//     text: 'Gwen: si Sheena?'
//   },
//   {
//     id: '8',
//     title: 'Stacey Sevilleja',
//     image: require('../assets/bini/stacey.jpg'),
//     text: 'Stacey changed her nickname into Princess <3.'
//   },
//   {
//     id: '9',
//     title: 'Alfea Zulueta',
//     image: require('../assets/bini/alf.jpg'),
//     text: 'Alfea sent you a voice message.'
//   },
//   {
//     id: '10',
//     title: 'Mikha Lim',
//     image: require('../assets/bini/mikha.jpg'),
//     text: 'Mikha: Ba\'t kasi nagpagas pa?'
//   },
//   {
//     id: '11',
//     title: 'Nicole Torres',
//     image: require('../assets/bini/nics.jpg'),
//     text: 'Nicole unsent a message.'
//   },
//   {
//     id: '12',
//     title: 'Jhoanna Robles',
//     image: require('../assets/bini/jho.jpg'),
//     text: 'Jhoanna: HAHAHAHAHHH'
//   },
//   {
//     id: '13',
//     title: 'Klaus Lastimosa',
//     image: require('../assets/bini/klaus.jpg'),
//     text: 'Klaus tagged you in his story.'
//   },
//   {
//     id: '14',
//     title: 'Sheena Catacutan',
//     image: require('../assets/bini/sheena.jpg'),
//     text: 'Sheena: PUFFERFISHHHHHHHHHHHHH'
//   },
//   {
//     id: '15',
//     title: 'Jazmine Henry',
//     image: require('../assets/bini/jaz.jpg'),
//     text: 'Jazmine: Malambot na byahe? HAHA'
//   },
// ];

//! ITEM ITERATE FOR FLATLIST
const Item = ({ name }) => (
  <View style={styles.item}>
    <View style={styles.imageContainer}>
      <View style={styles.onlineIndicator}></View>
    </View>
    <View>
      <Text style={styles.title}>{name}</Text>
    </View>
  </View>
);

const chats = [
  {
    id: '1',
    name: 'Aiah',
  },
  {
    id: '2',
    name: 'Colet',
  },
  {
    id: '3',
    name: 'Kylo Ren',
  },
]

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
        {chats.length === 0 ? (

          <View style={{
            flex: 1,
            marginTop: 125,
          }}>
            <Text style={styles.temp_text}>No Conversations Found. </Text>
            <Text style={styles.temp_text}>Start a New Chat.</Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={chats}
            renderItem={({ item }) => <Item name={item.name} />}
            keyExtractor={item => item.id}
            style={{ marginTop: 30, paddingBottom: 10 }}
          />
        )}
        {/* //! FLATLIST */}
        {/* <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item }) => <Item image={item.image} title={item.title} text={item.text} />}
          keyExtractor={item => item.id}
          style={{ marginTop: 1.5, paddingBottom: 10 }}
        /> */}
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
            onPress={
              console.log('CHANGE THIS ONCE THE FUNCTION IS READY.')
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