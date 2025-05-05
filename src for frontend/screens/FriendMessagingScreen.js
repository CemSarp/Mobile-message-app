import React, {useState, useEffect, useRef, useCallback} from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import api from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

const FriendMessagingScreen = (callback, deps) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [friendName, setFriendName] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const {friendId} = route.params;

  // Ref for FlatList
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchFriendDetails();
  }, [fetchFriendDetails, fetchMessages]);

  // Fetch conversation messages
  const fetchMessages = useCallback(async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(
        `/messages/conversation/${userId}/${friendId}`,
      );
      const formattedMessages = response.data.map(msg => ({
        ...msg,
        formattedTime: new Date(msg.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [friendId]);

  // Fetch friend details (username or email)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFriendDetails = async () => {
    try {
      const response = await api.get(`/friends/details/${friendId}`);
      setFriendName(response.data.username || response.data.email);
      navigation.setOptions({
        title: response.data.username || response.data.email,
      });
    } catch (error) {
      console.error('Error fetching friend details:', error);
      navigation.setOptions({title: 'Chat'});
    }
  };

  const sendMessage = async () => {
    const sender = await AsyncStorage.getItem('userId');
    const messageData = {
      sender,
      recipient: friendId,
      content: newMessage,
      isGroupMessage: false,
    };
    try {
      await api.post('/messages/send', messageData);
      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef} // Attach ref to FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.messageBox}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.timestamp}>{item.formattedTime}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messageBox: {
    maxWidth: '80%',
    alignSelf: 'flex-start',
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#B3E5FC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1565C0',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
});

export default FriendMessagingScreen;
