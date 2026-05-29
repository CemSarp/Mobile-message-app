import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import api from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const GroupListScreen = () => {
  const [groups, setGroups] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchGroupList();
  }, []);

  const fetchGroupList = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(`/groups/list/${userId}`);
      setGroups(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch groups.');
    }
  };

  const handleGroupSelect = (groupId) => {
    navigation.navigate('GroupDetails', { groupId });
  };

  const handleGroupMessage = (groupId) => {
    navigation.navigate('GroupMessaging', { groupId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group List</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Text style={styles.groupName}>{item.name}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleGroupSelect(item.id)}
              >
                <Text style={styles.buttonText}>See Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.messageButton]}
                onPress={() => handleGroupMessage(item.id)}
              >
                <Text style={styles.buttonText}>Group Chat</Text>
              </TouchableOpacity>
            </View>
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
  groupItem: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
  },
  groupName: {
    fontSize: 22,  // Larger font size for the group name
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',  // Arrange buttons horizontally
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    width: 130,
    alignItems: 'center',
    marginHorizontal: 5,  // Space between buttons
  },
  messageButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GroupListScreen;
