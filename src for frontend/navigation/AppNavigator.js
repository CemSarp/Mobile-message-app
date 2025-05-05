import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FriendRequestScreen from '../screens/FriendRequestScreen';
import FriendListScreen from '../screens/FriendListScreen';
import MainScreen from '../screens/MainScreen';
import GroupListScreen from '../screens/GroupListScreen';
import GroupDetailsScreen from '../screens/GroupDetailsScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import GroupMessagingScreen from '../screens/GroupMessagingScreen';
import FriendMessagingScreen from '../screens/FriendMessagingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
        <Stack.Screen name="FriendList" component={FriendListScreen} />
        <Stack.Screen name="GroupList" component={GroupListScreen} />
        <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
        <Stack.Screen name="GroupMessaging" component={GroupMessagingScreen} />
        <Stack.Screen name="FriendMessaging" component={FriendMessagingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
