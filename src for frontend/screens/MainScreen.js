import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

  // Fetch user email from storage
  useEffect(() => {
    const fetchUserData = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
      } else {
        Alert.alert('Error', 'Failed to load user data.');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    };
    fetchUserData();
  }, [navigation]);

  // Handle Logout
  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userEmail}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FriendRequest')}
      >
        <Text style={styles.buttonText}>Send and Accept Friend Request</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FriendList')}
      >
        <Text style={styles.buttonText}>View Your Friends</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GroupList')}
      >
        <Text style={styles.buttonText}>View Your Groups</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styling for the buttons and layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainScreen;
