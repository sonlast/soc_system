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
  const { user } = route.params;

  useLayoutEffect(() => {
    const q = query(collection(firestore, 'chats'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
            }))
        ));

        return () => {
          unsubscribe();
        };

    });

    const onSend = useCallback((messages = []) => {
        const { _id, createdAt, text, user,} = messages[0]

        addDoc(collection(firestore, 'chats'), { _id, createdAt,  text, user });
    }, []);

  //   if (auth.currentUser && user) {
  //     const q = query(
  //       collection(firestore, 'chats'),
  //       where('participants', 'array-contains', auth.currentUser.uid),
  //       orderBy('createdAt', 'desc')
  //     );

  //     const unsubscribe = onSnapshot(q, (snapshot) => {
  //       const messagesFirestore = snapshot.docs.map((doc) => {
  //         const data = doc.data();
  //         return {
  //           _id: doc.id,
  //           text: data.text,
  //           createdAt: data.createdAt.toDate(),
  //           user: data.user,
  //         };
  //       });
  //       setMessages(messagesFirestore);
  //     });

  //     return () => {
  //       unsubscribe();
  //     };
  //   }
  // }, [firestore, auth.currentUser, user]);

  // const onSend = useCallback(async (messages = []) => {
  //   const message = messages[0];
  // console.log('Message to send:', message);

  // if (!message || !message._id || !message.createdAt || !message.text || !message.user) {
  //   console.error('Invalid message format:', message);
  //   return;
  // }
  
  //   const { _id, createdAt, text, user: sender } = messages[0];
  //   const chatId = [auth.currentUser.uid, user.uid].sort().join('_');

  //   try {
  //     await addDoc(collection(firestore, 'chats'), {
  //       _id,
  //       createdAt: new Date(),
  //       text,
  //       user: sender,
  //       participants: [auth.currentUser.uid, user.uid],
  //     });
  //     console.log('Message sent successfully!');
  //   } catch (error) {
  //     console.error('Error sending message: ', error);
  //   }
  // }, [auth.currentUser.uid, user.uid, firestore]);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        avatar: auth.currentUser.photoURL,
      }}
    />
  );
};

export default ChatScreen;