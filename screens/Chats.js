import React, {useEffect,} from 'react'
import { BackHandler, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
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
//     image: require('../assets/profilepic.jpeg'),
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
// const Item = ({ title, image, text }) => (
//   <View style={styles.item}>
//     <View style={styles.imageContainer}>
//       <Image source={image} style={styles.image} />
//       <View style={styles.onlineIndicator}></View>
//     </View>
//     <View>
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.chat}>{text}</Text>
//     </View>
//   </View>
// );

const Chats = () => {

  useFocusEffect(
    React.useCallback(() => {
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
              }
            ]}
          >
            <Image
              style={styles.profilepic}
              source={require('../assets/profilepic.jpeg')}
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
                console.log('Add Chat Pressed')
              }>
              <FontAwesomeIcon icon={faPenToSquare} color="#f0ceff" size={25} style={{ alignContent: 'center' }} />
            </Pressable>
          </View>
        </View>
        {/* //! FLATLIST */}
        {/* <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item }) => <Item image={item.image} title={item.title} text={item.text} />}
          keyExtractor={item => item.id}
          style={{ marginTop: 1.5, paddingBottom: 10 }}
        /> */}
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
  }
  //!  FOR THE FLATLIST
  // item: {
  //   flexDirection: 'row',
  //   backgroundColor: '#f9c2ff',
  //   paddingLeft: 10,
  //   padding: 5,
  //   marginVertical: 10,
  //   marginHorizontal: 5,
  //   borderRadius: 30,
  // },
  // title: {
  //   fontSize: 20,
  //   fontFamily: 'TitilliumWeb_400Regular',
  //   paddingLeft: 10,
  //   textAlignVertical: 'center',
  // },
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