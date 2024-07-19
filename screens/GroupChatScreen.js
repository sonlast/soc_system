import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, collection, query, where, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';
import { app } from '../firebaseConfig';

const GroupChatScreen = ({ route, navigation }) => {
  const { groupId, groupName, } = route.params; // Pass groupId and groupName through route params
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: groupName,
    })
  })

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
      <Text style={styles.groupName}>{groupName}</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{new Date(item.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          style={styles.input}
          placeholder="Type a message"
        />
        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  messagesList: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'column',
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'TitilliumWeb_400Regular',
  },
  messageTime: {
    fontSize: 12,
    textAlign: 'right',
    color: 'grey',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#4c669f',
    borderRadius: 5,
    marginLeft: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GroupChatScreen;
