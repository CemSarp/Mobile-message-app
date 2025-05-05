import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import api from '../services/ApiService';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupDetailsScreen = () => {
  const [groupDetails, setGroupDetails] = useState({});
  const route = useRoute();
  const { groupId } = route.params;

  const fetchGroupDetails = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get(`/groups/details/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroupDetails(response.data);
    } catch (error) {
      console.log('Fetch Error:', error.response || error.message);
      Alert.alert('Error', 'Failed to fetch group details.');
    }
  }, [groupId]);  // Only re-create if groupId changes

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);  // Now it's safe to include


  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();  // Format date and time (local timezone)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{groupDetails.name}</Text>
      <Text style={styles.subText}>
        Created At: {groupDetails.createdAt ? formatDateTime(groupDetails.createdAt) : 'N/A'}
      </Text>

      <Text style={styles.sectionTitle}>Members:</Text>

      <FlatList
        data={groupDetails.memberNames || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <Text style={styles.memberText}>{item}</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  memberText: {
    fontSize: 18,
    textAlign: 'left',
  },
});

export default GroupDetailsScreen;
