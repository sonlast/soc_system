import * as React from 'react'
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';

const data = [
  {
    id: '1',
    title: 'Aiah Arceta',
    image: require('../assets/bini/aiah.jpg'),
  },
  {
    id: '2',
    title: 'Colet Vergara',
    image: require('../assets/bini/colet.jpg'),
  },
  {
    id: '3',
    title: 'Kylo Ren',
    image: require('../assets/profilepic.jpeg'),
  },
  {
    id: '4',
    title: 'Maloi Ricalde',
    image: require('../assets/bini/maloi.jpg'),
  },
  {
    id: '5',
    title: 'AJ Yape',
    image: require('../assets/bini/aj.jpg'),
  },
  {
    id: '6',
    title: 'Princess Torres',
    image: require('../assets/bini/cess.jpg'),
  },
  {
    id: '7',
    title: 'Gwen Apuli',
    image: require('../assets/bini/gwen.jpg'),
  },
  {
    id: '8',
    title: 'Stacey Sevilleja',
    image: require('../assets/bini/stacey.jpg'),
  },
  {
    id: '9',
    title: 'Alfea Zulueta',
    image: require('../assets/bini/alf.jpg'),
  },
  {
    id: '10',
    title: 'Mikha Lim',
    image: require('../assets/bini/mikha.jpg'),
  },
  {
    id: '11',
    title: 'Nicole Torres',
    image: require('../assets/bini/nics.jpg'),
  },
  {
    id: '12',
    title: 'Jhoanna Robles',
    image: require('../assets/bini/jho.jpg'),
  },
  {
    id: '13',
    title: 'Klaus Lastimosa',
    image: require('../assets/bini/klaus.jpg'),
  },
  {
    id: '14',
    title: 'Sheena Catacutan',
    image: require('../assets/bini/sheena.jpg'),
  },
  {
    id: '15',
    title: 'Jazmine Henry',
    image: require('../assets/bini/jaz.jpg'),
  },
];

const Item = ({ title, image }) => (
  <View style={styles.item}>
    <Image source={image} style={styles.image} />
    <Text style={styles.title}>{title}</Text>
  </View>
)

const Chats = () => {
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
            <Pressable
              onPress={() => {
                console.log('Profile Picture Pressed');
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
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({ item }) => <Item image={item.image} title={item.title} />}
            keyExtractor={item => item.id}
            style={{ marginTop: 1.5, paddingBottom: 40 }}
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
    paddingTop: 30,
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
    verticalAlign: 'center',
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
    padding: 12.5,
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
  image: {
    width: 40,
    height: 40,
    borderRadius: 40,
  }
})

export default Chats;