import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, View, StyleSheet, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mediaDevices, RTCView, RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';
import { useFonts, TitilliumWeb_400Regular, TitilliumWeb_600SemiBold } from '@expo-google-fonts/titillium-web';

const VideoCallScreen = () => {
  const navigation = useNavigation();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localStreamRef = useRef();
  const peerConnectionRef = useRef(null); // Ref to hold peerConnection instance

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("ChatScreen");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up event listener on unmount
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    // Initialize peerConnection inside useEffect
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    const startLocalStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);
        localStreamRef.current = stream;

        stream.getTracks().forEach(track => {
          if (peerConnectionRef.current) {
            peerConnectionRef.current.addTrack(track, stream);
          }
        });

        if (peerConnectionRef.current) {
          peerConnectionRef.current.ontrack = (event) => {
            const [stream] = event.streams;
            setRemoteStream(stream);
          };

          peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
              // Send the ICE candidate to the remote peer
            }
          };
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    startLocalStream();

    // Clean up function
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null; // Clear reference
      }
    };
  }, []);

  const startCall = async () => {
    try {
      if (peerConnectionRef.current) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(new RTCSessionDescription(offer));
        // Send the offer to the remote peer
      }
    } catch (error) {
      console.error('Error starting call:', error);
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
      {localStream && <RTCView streamURL={localStream.toURL()} style={styles.rtcView} />}
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={styles.rtcView} />}
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          { backgroundColor: pressed ? '#4c669f' : '#f0ceff' },
        ]}
        onPress={startCall}
      >
        <Text style={styles.pressableText}>Start Call</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4c669f',
  },
  rtcView: {
    width: '100%',
    height: '100%',
  },
  pressable: {
    position: 'absolute',
    bottom: 70,
    padding: 10,
    borderRadius: 5,
  },
  pressableText: {
    fontFamily: 'TitilliumWeb_600SemiBold',
    fontSize: 17.5,
  },
});

export default VideoCallScreen;
