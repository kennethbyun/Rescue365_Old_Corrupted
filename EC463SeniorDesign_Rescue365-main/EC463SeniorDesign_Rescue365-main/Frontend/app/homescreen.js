import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Rescue365!</Text>
      <Text style={styles.message}>You are logged in successfully.</Text>

      {/* Button to navigate to the main functionality (App.js code) */}
      <Button 
        title="Go to Dashboard" 
        onPress={() => navigation.navigate('Dashboard')} 
      />
      
      {/* Optional logout button */}
      <Button 
        title="Log out" 
        onPress={() => navigation.navigate('Login')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8f5',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3b7d3c',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});
