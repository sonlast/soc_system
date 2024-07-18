import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]); // Fetch the list of users from Firestore

  const firestore = getFirestore(app);

  const createGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      return; // Handle validation
    }
    try {
      await addDoc(collection(firestore, 'groups'), {
        name: groupName,
        participants: selectedUsers,
        createdAt: new Date(),
      });
      navigation.navigate('ChatScreen'); // Navigate to the chat screen or group chat list
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedUsers([...selectedUsers, item.id])}>
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Create Group" onPress={createGroup} />
    </View>
  );
};

export default CreateGroupScreen;
