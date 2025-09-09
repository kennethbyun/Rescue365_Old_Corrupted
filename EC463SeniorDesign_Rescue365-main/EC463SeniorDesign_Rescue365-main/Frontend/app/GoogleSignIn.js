import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = 'https://rzzmcluceplcovvixock.supabase.co/';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function GoogleSignIn({ navigation }) {
  // The function that triggers Google sign-in
  const handleGoogleSignIn = async () => {
    console.log("Google Sign In button pressed");

    // Build the redirect URI using your app's scheme
    const redirectUri = Linking.createURL("/auth/callback");
    console.log("Redirect URI:", redirectUri);

    // Request sign-in with Google
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUri },
    });

    console.log("Supabase Response:", data, error);

    // If Supabase returns a URL, open it in the browser for OAuth
    if (data?.url) {
      console.log("Opening browser:", data.url);
      await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
    }

    if (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign in with Google</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Google Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b7d3c',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});