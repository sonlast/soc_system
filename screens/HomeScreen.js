import * as React from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';

const data = [
  {
    id: '1',
    title: 'Aiah Arceta',
    image: require('../assets/profilepic.jpeg'),
  },
  {
    id: '2',
    title: 'Colet Vergara',
    image: require('../assets/profilepic.jpeg'),
  },
  {
    id: '3',
    title: 'Maloi Ricalde',
    image: require('../assets/profilepic.jpeg'),
  },
  {
    id: '4',
    title: 'Gwen Apuli',
    image: require('../assets/profilepic.jpeg'),
  },
  {
    id: '5',
    title: 'Stacey Sevilleja',
    image: require('../assets/profilepic.jpeg'),
  },
  {
    id: '6',
    title: 'Mikha Lim',
    image: require('../assets/profilepic.jpeg'),
  },
  {
    id: '7',
    title: 'Jhoanna Robles',
    image: require('../assets/profilepic.jpeg'),
  },
  {
    id: '8',
    title: 'Sheena Catacutan',
    image: require('../assets/profilepic.jpeg'),
  }
];

const Item = ({ title, image }) => (
  <View style={styles.item}>
    <Image source={image} style={styles.image}/>
    <Text style={styles.title}>{title}</Text>
  </View>
)

const HomeScreen = () => {
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
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity>
              <Image
                style={styles.profilepic}
                source={require('../assets/profilepic.jpeg')}
              />
            </TouchableOpacity>
            <Text style={styles.textheader}>
              Safe-on-chat
            </Text>
          </View>
          <FlatList
            data={data}
            renderItem={({ item }) => <Item image={item.image} title={item.title} />}
            keyExtractor={item => item.id}
            style={{marginTop: 60}}
          />
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
    paddingTop: 50,
    padding: 20,
  },
  linearg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
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
    paddingTop: 5,
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#f9c2ff',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: 'TitilliumWeb_400Regular',
    paddingLeft: 10,
    textAlignVertical: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 40,
  }
})

export default HomeScreen;