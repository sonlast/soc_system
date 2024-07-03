import React, { useState, useLayoutEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { app } from '../firebaseConfig';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const route = useRoute();
  const { user, profilePicture, username } = route.params;

  useLayoutEffect(() => {
    if (auth.currentUser && user && user.uid) {
      const participantIds = [auth.currentUser.uid, user.uid].sort();
      const q = query(
        collection(firestore, 'chats'),
        // where('participants', 'array-contains', auth.currentUser.uid),
          where('participants', '==', participantIds),
        // where('participants', 'array-contains', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesFirestore = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user,
          };
        });
        setMessages(messagesFirestore);
      });

      return () => {
        unsubscribe();
      };
    } else {
      console.error('Current user or chat participant is missing a UID');
    }
  }, [firestore, auth.currentUser, user]);

  const onSend = useCallback(async (messages = []) => {
    const message = messages[0];
    console.log('Message to send:', message);

    if (!message || !message._id || !message.createdAt || !message.text || !message.user) {
      console.error('Invalid message format:', message);
      return;
    }

    const { _id, createdAt, text, user: sender } = message;

    if (!auth.currentUser.uid || !user.uid) {
      console.error('Either the current user or the chat participant does not have a valid UID');
      return;
    }

    const participantIds = [auth.currentUser.uid, user.uid].sort();

    try {
      await addDoc(collection(firestore, 'chats'), {
        _id,
        createdAt: new Date(),
        text,
        user:{
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar,
        },
        participants: participantIds,
      });
      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  }, [auth.currentUser.uid, user.uid, firestore]);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth.currentUser.uid,
        name: username,
        avatar: profilePicture || './assets/profilepic.jpg',
      }}
    />
  );
};

export default ChatScreen;