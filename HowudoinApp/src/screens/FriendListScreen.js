import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const FriendListScreen = () => {
  const [friends, setFriends] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchFriendsList();
  }, []);

  const fetchFriendsList = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(`/friends/list/${userId}`);
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

  const handleSendMessage = (friendId) => {
    navigation.navigate('FriendMessaging', { friendId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>
      {friends.length === 0 ? (
        <Text style={styles.noFriendsText}>
          No friends yet. Accept friend requests to add friends.
        </Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Text style={styles.friendName}>{item.username || item.email}</Text>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => handleSendMessage(item.id)}
              >
                <Text style={styles.buttonText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
  friendItem: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
  },
  friendName: {
    fontSize: 24,  // Increased font size for friend's name
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noFriendsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default FriendListScreen;
