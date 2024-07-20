import React, { useEffect, useState } from 'react';
import { BackHandler, View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane, faPaperclip, faImage, faVideo, faPhone } from '@fortawesome/free-solid-svg-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, collection, query, where, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import { app } from '../firebaseConfig';
import { Avatar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

const GroupChatScreen = ({ route, navigation }) => {
  const { groupId, groupName, } = route.params; // Pass groupId and groupName through route params
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Avatar rounded title={groupName[0]} size={40} containerStyle={{
          backgroundColor: getRandomColor(),
          marginRight: 15,
        }} />
      ),
      headerTitle: groupName,
      headerBackVisible: false,
    })
  }, [navigation, groupName]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("GroupChats");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const messagesRef = collection(firestore, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [groupId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const messagesRef = collection(firestore, 'groups', groupId, 'messages');
      await addDoc(messagesRef, {
        text: messageText,
        senderId: auth.currentUser.uid,
        username: auth.currentUser.displayName,
        createdAt: Timestamp.now(),
      });
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
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
        style={{ flex: 1 }}
        start={[0.5, 0.5]}
      >
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={[
              styles.messageContainer,
              item.senderId === auth.currentUser.uid ? styles.currentUserMessage : styles.otherUserMessage
            ]}>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageTime}>{new Date(item.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            style={styles.input}
            placeholder="Type a message"
          />
          <Pressable onPress={sendMessage} style={styles.sendButton}>
            <FontAwesomeIcon icon={faPaperPlane} size={20} style={{ color: '#000' }} />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontFamily: 'TitilliumWeb_600SemiBold',
    textAlign: 'center',
    marginVertical: 10,
  },
  messagesList: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'column',
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'TitilliumWeb_400Regular',
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'TitilliumWeb_400Regular',
    textAlign: 'right',
    color: 'grey',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    padding: 5,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 5,
    fontFamily: 'TitilliumWeb_400Regular',
  },
  sendButton: {
    padding: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 5,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
});

export default GroupChatScreen;
