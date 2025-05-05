import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import api from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

const GroupMessagingScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId } = route.params;

  // Create ref for FlatList
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchGroupMessages();
    fetchGroupName();
  }, []);

  // Fetch group messages
  const fetchGroupMessages = async () => {
    try {
      const response = await api.get(`/group-messages/${groupId}`);
      const formattedMessages = response.data.map(msg => ({
        ...msg,
        formattedTime: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching group messages:', error);
    }
  };

  // Fetch group name
  const fetchGroupName = async () => {
    try {
      const response = await api.get(`/groups/details/${groupId}`);
      setGroupName(response.data.name);
      navigation.setOptions({ title: response.data.name });
    } catch (error) {
      console.error('Error fetching group name:', error);
      navigation.setOptions({ title: 'Group Chat' });
    }
  };

  const sendMessage = async () => {
    const sender = await AsyncStorage.getItem('userId');
    const messageData = {
      sender,
      content: newMessage,
    };
    try {
      await api.post(`/group-messages/send/${groupId}`, messageData);
      setNewMessage('');
      fetchGroupMessages();  // Refresh messages after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
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
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
});

export default GroupMessagingScreen;
