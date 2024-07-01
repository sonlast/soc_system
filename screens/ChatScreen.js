import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  useEffect(() => {
    const q = query(collection(firestore, 'chats'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesFirestore = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: data.user
        };
      });
      setMessages(messagesFirestore);
    });
    
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(firestore, 'chats'), {
      _id,
      createdAt,
      text,
      user
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth.currentUser.uid,
        name: auth.currentUser.displayName || 'User',
        avatar: auth.currentUser.photoURL || null,
      }}
    />
  );
};

export default ChatScreen;


// // ChatScreen.js
// import React, { useState, useCallback, useEffect } from 'react';
// import { GiftedChat } from 'react-native-gifted-chat';
// import { View, StyleSheet } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import crypto from 'crypto-js';

// const ChatScreen = ({ route }) => {
//   const { chatId, chatName } = route.params;
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection('chats')
//       .doc(chatId)
//       .collection('messages')
//       .orderBy('createdAt', 'desc')
//       .onSnapshot(querySnapshot => {
//         const messagesFirestore = querySnapshot.docs.map(doc => {
//           const firebaseData = doc.data();

//           const message = {
//             _id: doc.id,
//             text: decryptMessage(firebaseData.text),
//             createdAt: firebaseData.createdAt.toDate(),
//             user: firebaseData.user,
//           };

//           return message;
//         });

//         setMessages(messagesFirestore);
//       });

//     return () => unsubscribe();
//   }, [chatId]);

//   const encryptMessage = (text) => {
//     return crypto.AES.encrypt(text, 'secret_key').toString();
//   };

//   const decryptMessage = (encryptedText) => {
//     const bytes = crypto.AES.decrypt(encryptedText, 'secret_key');
//     return bytes.toString(crypto.enc.Utf8);
//   };

//   const onSend = useCallback((messages = []) => {
//     const text = messages[0].text;

//     firestore()
//       .collection('chats')
//       .doc(chatId)
//       .collection('messages')
//       .add({
//         text: encryptMessage(text),
//         createdAt: new Date(),
//         user: messages[0].user,
//       });
//   }, [chatId]);

//   return (
//     <View style={styles.container}>
//       <GiftedChat
//         messages={messages}
//         onSend={messages => onSend(messages)}
//         user={{
//           _id: 1, // Replace with authenticated user ID
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });

// export default ChatScreen;
