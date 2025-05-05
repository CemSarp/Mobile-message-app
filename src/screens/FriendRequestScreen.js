import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendRequestScreen = () => {
  const [username, setUsername] = useState('');
  const [requests, setRequests] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchFriendRequests();
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id);
  };

  const fetchFriendRequests = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(`/friends/requests/${userId}`);
      setRequests(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load friend requests.');
    }
  };

  const handleAddFriend = async () => {
    const senderId = await AsyncStorage.getItem('userId');
    if (!username) {
      Alert.alert('Error', 'Please enter a valid username.');
      return;
    }

    try {
      await api.post('/friends/add', {
        senderId: senderId,
        receiverId: username,
      });
      Alert.alert('Success', 'Friend request sent!');
      setUsername('');
      await fetchFriendRequests();
    } catch (error) {
      Alert.alert('Error', error.response?.data || 'Request failed. Please try again.');
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await api.put(`/friends/request/${requestId}`, null, {
        params: { status },
      });
      Alert.alert('Success', `Friend request ${status.toLowerCase()}.`);
      await fetchFriendRequests();
    } catch (error) {
      Alert.alert('Error', `Failed to ${status.toLowerCase()} friend request.`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Friend Requests</Text>

      <TextInput
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleAddFriend} style={styles.button}>
        <Text style={styles.buttonText}>Send Friend Request</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Pending Friend Requests</Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.requestId}
        renderItem={({ item }) => (
          <View style={styles.requestContainer}>
            <Text style={styles.requestText}>
              {item.senderId === userId
                ? `To: ${item.receiverUsername}`
                : `From: ${item.senderUsername}`}
            </Text>
            <Text>Status: {item.status}</Text>

            {item.status === 'PENDING' && item.receiverId === userId && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => handleRequestAction(item.requestId, 'ACCEPTED')}
                  style={[styles.actionButton, { backgroundColor: 'green' }]}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleRequestAction(item.requestId, 'REJECTED')}
                  style={[styles.actionButton, { backgroundColor: 'red' }]}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
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
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
  },
  requestContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  requestText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default FriendRequestScreen;
