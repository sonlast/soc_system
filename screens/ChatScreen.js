import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, BackHandler, Image, Text, View, StyleSheet } from 'react-native';
import { TextInput, Composer, GiftedChat, Bubble, MessageText, InputToolbar, Send } from 'react-native-gifted-chat';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, orderBy, doc, updateDoc, setDoc, serverTimestamp, query, onSnapshot, where } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { app } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const route = useRoute();
  const { user, profilePicture, username } = route.params;
  const participantIds = [auth.currentUser.uid, user.uid].sort().join('_');

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Chats");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderWithPicture username={username} profilePicture={profilePicture} />,
    });

    if (auth.currentUser && user && user.uid) {
      const q = query(
        collection(firestore, 'chats'),
        where('participants', '==', participantIds),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesFirestore = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data.user._id,
              name: username,
              avatar: profilePicture,
            },
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

  useLayoutEffect(() => {
    if (auth.currentUser && user && user.uid) {
      const typingDocRef = doc(firestore, 'typingStatus', participantIds);

      const unsubscribe = onSnapshot(typingDocRef, (doc) => {
        const data = doc.data();
        if (data) {
          setIsTyping(data.typing && data.typing !== auth.currentUser.uid);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [firestore, auth.currentUser, user, participantIds]);

  const onSend = useCallback(async (messages = []) => {
    const message = messages[0];
    // console.log('Message to send:', message);

    if (!message || !message._id || !message.createdAt || !message.text || !message.user) {
      console.error('Invalid message format:', message);
      return;
    }

    const { _id, createdAt, text, user: sender } = message;

    if (!auth.currentUser.uid || !user.uid) {
      console.error('Either the current user or the chat participant does not have a valid UID');
      return;
    }

    try {
      await addDoc(collection(firestore, 'chats'), {
        _id,
        createdAt: new Date(),
        text,
        // user: sender,
        user: sender,
        participants: participantIds,
      });
      console.log('Message sent successfully!');
      await updateDoc(doc(firestore, 'typingStatus', participantIds), {
        typing: '',
        lastTyped: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  }, [auth.currentUser.uid, user.uid, firestore, participantIds]);

  const handleInputTextChanged = async (text) => {
    const typingDocRef = doc(firestore, 'typingStatus', participantIds);

    if (text) {
      await setDoc(typingDocRef, {
        typing: auth.currentUser.uid,
        lastTyped: serverTimestamp(),
      }, { merge: true });
    } else {
      await updateDoc(typingDocRef, {
        typing: '',
        lastTyped: serverTimestamp(),
      });
    }
  };

  const HeaderWithPicture = ({ username, profilePicture }) => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Image source={{ uri: profilePicture }} style={{
          width: 45,
          height: 45,
          borderRadius: 25,
          marginRight: 10,
        }} />
        <Text style={{
          color: '#fff',
          fontSize: 20,
          fontFamily: 'TitilliumWeb_600SemiBold',
        }}>{username}</Text>
      </View>
    );
  };

  const CustomMessageText = (props) => {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: [styles.text, styles.textLeft],
          right: [styles.text, styles.textRight],
        }}
      />
    );
  };

  const CustomBubble = (props) => {
    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#4c669f',
            },
            left: {
              backgroundColor: '#f0ceff',
            },
          }}
        />
      </View>
    );
  };

  const CustomInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: '#4c669f',
          maxHeight: 60,
          overflow: 'hidden',
        }}
        renderComposer={(composerprops) => (
          <Composer
            {...composerprops}
            textInputStyle={{
              color: '#fff',
              fontFamily: 'TitilliumWeb_400Regular',
              flex: 1,
              multiline: true,
            }}
            placeholderTextColor='#fff'
          />
        )
        }
      />
    );
  }

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={{
          marginRight: 20,
          marginBottom: 10,
        }}>
          <FontAwesomeIcon icon={faPaperPlane} size={20} color='white' />
        </View>
      </Send>
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth.currentUser.uid,
        name: username,
        avatar: profilePicture || './assets/profilepic.jpg',
      }}
      renderBubble={CustomBubble}
      isTyping={isTyping}
      onInputTextChanged={handleInputTextChanged}
      renderMessageText={CustomMessageText}
      renderInputToolbar={CustomInputToolbar}
      renderAvatarOnTop={true}
      renderSend={renderSend}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'TitilliumWeb_400Regular'
  },
  textLeft: {
    color: '#000', // Text color for received messages
  },
  textRight: {
    color: '#fff', // Text color for sent messages
  },
})

export default ChatScreen;