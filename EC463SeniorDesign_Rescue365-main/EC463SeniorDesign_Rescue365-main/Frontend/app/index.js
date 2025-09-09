import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './login';
import SignUp from './signup';
import HomeScreen from './HomeScreen';
import GoogleSignIn from './GoogleSignIn';
import App from './App';

const Stack = createStackNavigator();

export default function IndexApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GoogleSignIn">
      <Stack.Screen name="GoogleSignIn" component={GoogleSignIn} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Dashboard" component={App} options={{ title: 'Rescue365' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
