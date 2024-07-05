import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { BackHandler, Image, Text, View, StyleSheet, Pressable } from 'react-native';
import { Composer, GiftedChat, Bubble, MessageText, InputToolbar, Send } from 'react-native-gifted-chat';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, orderBy, doc, updateDoc, setDoc, serverTimestamp, query, onSnapshot, where } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { app } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane, faPaperclip, faImage, faVideo, faPhone } from '@fortawesome/free-solid-svg-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

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
          setIsTyping(!!data.typing && data.typing !== auth.currentUser.uid);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [firestore, auth.currentUser, user, participantIds]);

  const onSend = useCallback(async (messages = [], fileURL = null, fileType = null) => {
    const message = messages[0];

    if (!message || !message._id || !message.createdAt || !message.user) {
      console.error('Invalid message format:', message);
      return;
    }

    const { _id, createdAt, text, user: sender } = message;

    if (!auth.currentUser.uid || !user.uid) {
      console.error('Either the current user or the chat participant does not have a valid UID');
      return;
    }

    try {
      const messageData = {
        _id,
        createdAt: new Date(),
        text: fileURL ? '' : text,
        user: sender,
        participants: participantIds,
      };

      if (fileURL) {
        messageData.file = fileURL;
        messageData.fileType = fileType;
      }

      await addDoc(collection(firestore, 'chats'), messageData);
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

  const uploadFile = async (uri, fileType) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage(app);
    const fileRef = ref(storage, `${fileType}/${new Date().getTime()}_${auth.currentUser.uid}`);

    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        console.log('Image picked:', result.uri);
        const fileURL = await uploadFile(result.uri, 'images');
        const message = {
          _id: new Date().getTime().toString(),
          createdAt: new Date(),
          user: {
            _id: auth.currentUser.uid,
            name: username,
            avatar: profilePicture || './assets/profilepic.jpg',
          },
          text: '',
        };
        onSend([message], fileURL, 'image');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (result.type === 'success') {
        console.log('Document picked:', result.uri);
        const fileURL = await uploadFile(result.uri, 'documents');
        const message = {
          _id: new Date().getTime().toString(),
          createdAt: new Date(),
          user: {
            _id: auth.currentUser.uid,
            name: username,
            avatar: profilePicture || './assets/profilepic.jpg',
          },
          text: '',
        };
        onSend([message], fileURL, 'document');
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };


  const HeaderWithPicture = ({ username, profilePicture }) => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
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
        <FontAwesomeIcon
          icon={faPhone}
          size={21}
          color='#fff'
          style={{
            position: 'absolute',
            right: 140,
          }}
        />
        <FontAwesomeIcon
          icon={faVideo}
          size={25}
          color='#fff'
          style={{
            position: 'absolute',
            right: 90,
          }}
        />
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
        {props.currentMessage.fileType === 'image' && (
          <Image
            source={{ uri: props.currentMessage.file }}
            style={{ width: 200, height: 200, borderRadius: 10, marginTop: 5 }}
          />
        )}
        {props.currentMessage.fileType === 'document' && (
          <Text
            style={{
              color: '#0000EE',
              textDecorationLine: 'underline',
              marginTop: 5,
            }}
            onPress={() => Linking.openURL(props.currentMessage.file)}
          >
            Open Document
          </Text>
        )}
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
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
            <Pressable
              onPress={pickImage}
              style={{
                marginRight: 10,
              }}
            >
              <FontAwesomeIcon icon={faImage} size={20} color='white' />
            </Pressable>
            <Pressable
              onPress={pickDocument}
              style={{
                marginRight: 10,
              }}
            >
              <FontAwesomeIcon icon={faPaperclip} size={20} color='white' />
            </Pressable>
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
          </View>
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