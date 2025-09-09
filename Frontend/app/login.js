/*import React from 'react';
import { View, Text } from 'react-native';

export default function LoginScreen() {
  return (
    <View>
      <Text>Welcome to Rescue365 - Login Screen</Text>
    </View>
  );
}
*/
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      // If both email and password are provided, navigate to Home screen
      navigation.navigate('Home'); // This will go to HomeScreen
    } else {
      alert('Please fill in both fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login to Rescue365</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} color="#3b7d3c" />

      <Text style={styles.linkText} onPress={() => alert('Navigate to sign up')}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f8f5',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3b7d3c',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  linkText: {
    textAlign: 'center',
    color: '#3b7d3c',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
