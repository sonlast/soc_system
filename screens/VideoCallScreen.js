import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { mediaDevices, RTCView, RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const peerConnection = new RTCPeerConnection(configuration);

const VideoCallScreen = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();

  useEffect(() => {
    const startLocalStream = async () => {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;

      peerConnection.addStream(stream);
    };

    startLocalStream();

    peerConnection.onaddstream = (event) => {
      setRemoteStream(event.stream);
      remoteStreamRef.current = event.stream;
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the ICE candidate to the remote peer
      }
    };

    return () => {
      localStream && localStream.release();
      peerConnection.close();
    };
  }, []);

  const startCall = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    // Send the offer to the remote peer
  };

  return (
    <View style={styles.container}>
      {localStream && <RTCView streamURL={localStream.toURL()} style={styles.rtcView} />}
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={styles.rtcView} />}
      <Button title="Start Call" onPress={startCall} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rtcView: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
  },
});

export default VideoCallScreen;
