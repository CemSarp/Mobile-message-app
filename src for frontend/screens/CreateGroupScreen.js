import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
    fetchFriendsList();
  }, []);

  // Fetch Friends List
  const fetchFriendsList = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(`/friends/list/${userId}`);
      console.log('Fetched Friends:', response.data);  // Debugging
      if (response.data.length === 0) {
        Alert.alert('No Friends', 'You do not have any friends yet.');
      } else {
        setFriends(response.data);
      }
    } catch (error) {
      console.log('Fetch Error:', error.response || error.message);
      Alert.alert('Error', 'Failed to fetch friends. Please try again.');
    }
  };

  const toggleSelectFriend = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedFriends.length === 0) {
      Alert.alert('Error', 'Please enter a group name and select at least one friend.');
      return;
    }
    const userId = await AsyncStorage.getItem('userId');
    try {
      await api.post('/groups/create', {
        name: groupName,
        members: [userId, ...selectedFriends],
      });
      Alert.alert('Success', 'Group created successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('Group Creation Error:', error.response || error.message);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Group</Text>

      <TextInput
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
        style={styles.input}
      />

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.friendItem,
              selectedFriends.includes(item.id) ? styles.friendSelected : null,
            ]}
            onPress={() => toggleSelectFriend(item.id)}
          >
            <Text style={styles.friendText}>{item.username || item.email}</Text>
            <Text style={styles.addText}>
              {selectedFriends.includes(item.id) ? 'Remove' : 'Add'}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#ddd',
    fontSize: 16,
  },
  friendItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  friendSelected: {
    backgroundColor: '#007bff',
  },
  friendText: {
    fontSize: 18,
  },
  addText: {
    color: '#007bff',
    fontSize: 16,
  },
  createButton: {
    marginTop: 30,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CreateGroupScreen;
