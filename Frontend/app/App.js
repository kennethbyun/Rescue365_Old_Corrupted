import React, { useState, useEffect } from 'react';
import { Text, View, Alert, TextInput, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import { getDistance } from 'geolib';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';




const googleLogo = require('./google.png');




// Initialize Supabase
const supabaseUrl = 'https://rzzmcluceplcovvixock.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6em1jbHVjZXBsY292dml4b2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5NTIyNTksImV4cCI6MjA0NjUyODI1OX0.wf6LqLc75Rz5BpgTOFER4FpVFOnpIADcEqvjOwPa164';
const supabase = createClient(supabaseUrl, supabaseKey);


export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Role: bystander, rescuer, vet staff
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [image, setImage] = useState(null);
  const [rescueReports, setRescueReports] = useState([]); // State for rescuers to track reports
  const [selectedReport, setSelectedReport] = useState(null); // Selected report by the rescuer




  useEffect(() => {
    const fetchSession = async () => {
      console.log("🔍 Checking session...");
 
      try {
        const { data, error } = await supabase.auth.getSession();
 
        console.log("Session data:", data);
        console.log("Session error:", error);
 
        if (data?.session) {
          console.log("✅ Session found:", data.session);
          setUser(data.session.user);
        } else {
          // If there's no session, log a message and skip the refresh attempt
          if (!error) {
            console.log("No active session found. User is not logged in.");
            return;
          }
 
          // If there's an error, log it and attempt to refresh the session
          console.error("❌ Session retrieval failed:", error);
 
          const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
 
          console.log("Refreshed session data:", refreshedSession);
          console.log("Refreshed session error:", refreshError);
 
          if (refreshedSession?.session) {
            console.log("✅ Session refreshed:", refreshedSession.session);
            setUser(refreshedSession.session.user);
          } else {
            console.error("❌ Session refresh failed:", refreshError);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching session:", err);
      }
    };
 
    fetchSession();
 
    // Listen for authentication state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("⚡ Auth State Changed:", event, session);
      setUser(session?.user || null);
    });
 
    return () => {
      listener.subscription?.unsubscribe();
    };
  }, []);
 




  WebBrowser.maybeCompleteAuthSession();




  // Sign In with Google using Supbase auth
  const handleGoogleSignIn = async () => {
    console.log("Google Sign In button pressed");
 
    const redirectUri = Linking.createURL("/auth/callback");
 
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUri },
    });
 
    if (error) {
      console.error("❌ Google Sign-In Error:", error);
      return;
    }
 
    if (data?.url) {
      console.log("🔄 Opening browser for sign-in...");
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
 
      if (result.type === "success") {
        console.log("✅ Auth session success, checking user state...");
 
        // Extract the access token from the URL
        const { access_token, refresh_token } = extractTokensFromUrl(result.url);
 
        if (access_token && refresh_token) {
          try {
            // Set the session manually
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
 
            if (sessionData?.session) {
              console.log("✅ User signed in:", sessionData.session.user);
              setUser(sessionData.session.user);
            } else {
              console.error("❌ Session retrieval failed:", sessionError);
            }
          } catch (setSessionError) {
            console.error("❌ Error setting session:", setSessionError);
          }
        }
      } else {
        console.log("User canceled sign-in.");
      }
    }
  };
 
  // Helper function to extract tokens from the URL
  const extractTokensFromUrl = (url) => {
    const params = new URLSearchParams(url.split("#")[1]);
    return {
      access_token: params.get("access_token"),
      refresh_token: params.get("refresh_token"),
    };
  };
 




  //Sign out function
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };




  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      console.log("Deep link triggered:", url);
 
      // Extract tokens from the URL
      const { access_token, refresh_token } = extractTokensFromUrl(url);
 
      if (access_token && refresh_token) {
        try {
          // Set the session manually
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
 
          if (sessionData?.session) {
            console.log("User session retrieved:", sessionData.session.user);
            setUser(sessionData.session.user);
          } else {
            console.error("Error retrieving session after login:", sessionError);
          }
        } catch (setSessionError) {
          console.error("❌ Error setting session:", setSessionError);
        }
      }
    };
 
    const subscription = Linking.addEventListener("url", handleDeepLink);
 
    return () => subscription.remove();
  }, []);




  // Get the user's location and reverse geocode it to an address
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission to access location was denied");
      return;
    }




    let currentLocation = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };








    // Reverse geocode to get the address
    const address = await Location.reverseGeocodeAsync(coords);




    setLocation({
      ...coords,
      address: `${address[0].name}, ${address[0].city}, ${address[0].region}`, // Format the address
    });
  };








  // Request camera permission if not already granted
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permission Denied",
        "Camera permission is required to take photos. Please enable it in your device settings."
      );
      return false;
    }
    return true;
  };








  // Allow users to upload or take a photo
  const pickImage = async () => {
    Alert.alert("Choose an option", "Would you like to take a photo or upload one?", [
      {
        text: "Take a Photo",
        onPress: async () => {
          const permissionGranted = await requestCameraPermission();
          if (!permissionGranted) return;








          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });








          if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImage(imageUri);
            Alert.alert("Photo Taken", "Your photo has been successfully taken.");
          }
        },
      },
      {
        text: "Upload from Gallery",
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });








          if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImage(imageUri);
            Alert.alert("Image Selected", "Your photo has been successfully selected.");
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };








  // Submit a rescue report (for bystander role)
  const submitRescueReport = async () => {
    if (!location || !description || !animalType || !image) {
      Alert.alert("Missing Information", "Please fill in all fields, add a photo, and get your location.");
      return;
    }








    // Insert data into Supabase
    const { data, error } = await supabase.from('rescue_reports').insert([
      {
        animal_type: animalType,
        description: description,
        location_lat: location.latitude,
        location_lng: location.longitude,
        address: location.address, // Include the address
        image_url: image,
        status: "Pending", // Initial status
      },
    ]);








    if (error) {
      console.error("Error submitting rescue report:", error);
      Alert.alert("Error", "There was an issue submitting the rescue report.");
    } else {
      Alert.alert("Report Submitted", "Your rescue report has been successfully submitted!");
      console.log(data);
    }
  };








  //Navigate to location in default maps app
  const navigateToLocation = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps://?q=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };








  // Update rescue status and remove completed reports
  const updateRescueStatus = async (reportId, status) => {
    const { data, error } = await supabase
      .from('rescue_reports')
      .update({ status })
      .eq('id', reportId);








    if (error) {
      console.error("Error updating rescue status:", error);
      Alert.alert("Error", "Unable to update rescue status.");
    } else {
      Alert.alert("Status Updated", `Rescue status set to "${status}".`);
      if (status === "Rescue Complete") {
        // Remove the completed case from the state
        setRescueReports(currentReports =>
          currentReports.filter(report => report.id !== reportId)
        );




        // Optional: Notify the bystander (placeholder logic)
        Alert.alert("Bystander Notified", "The original reporter has been notified.");
      }
    }
  };




  // Confirm navigation to location
  const confirmRescue = (report) => {
    Alert.alert(
      "Confirm Rescue",
      `Are you sure you want to navigate to this location?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            navigateToLocation(report.location_lat, report.location_lng);
          },
        },
      ]
    );
  };








  // Fetch and filter rescue reports for rescuers and vets
  useEffect(() => {
    const fetchReports = async () => {
      // Fetch all reports from Supabase
      const { data: reports, error } = await supabase.from('rescue_reports').select('*');
      if (error) {
        console.error("Error fetching rescue reports:", error);
        Alert.alert("Error", "Unable to fetch rescue reports.");
        return;
      }








      if (role === 'rescuer' && location) {
        // Filter reports within 10 miles for rescuers
        const nearbyReports = reports.filter((report) => {
          const distance = getDistance(
            { latitude: location.latitude, longitude: location.longitude },
            { latitude: report.location_lat, longitude: report.location_lng }
          );








          // Convert distance from meters to miles and filter within 10 miles
          return distance <= 10 * 1609.34 && report.status !== "Rescue Complete";
        });
        setRescueReports(nearbyReports);
      } else if (role === 'vet') {
        // Show only "In Progress" reports for vets
        const inProgressReports = reports.filter((report) => report.status === "Rescue In Progress");
        setRescueReports(inProgressReports);
      }
    };




    if (role === 'rescuer' || role === 'vet') {
      fetchReports();
    }
  }, [role, location]);




// If the user is not logged in, show the sign-in screen
if (!user) {
  return (
    <View style={styles.signInContainer}>
      <Text style={styles.signInHeader}>Rescue365</Text>
      <Text style= {styles.signInSubheader}>Save Lives, One Rescue at a Time!</Text>




      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Image source={googleLogo} style={styles.googleLogo} />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}




// If the user is logged in but hasn't selected a role, show the role selection screen
if (!role) {
  return (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      <Text style={styles.header}>Select Your Role:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity style={styles.roleButton} onPress={() => setRole('bystander')}>
          <FontAwesome5 name="paw" size={24} color="#fff" />
          <Text style={styles.roleText}>Bystander</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roleButton} onPress={() => setRole('rescuer')}>
          <MaterialIcons name="volunteer-activism" size={24} color="#fff" />
          <Text style={styles.roleText}>Rescuer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roleButton} onPress={() => setRole('vet')}>
          <FontAwesome5 name="clinic-medical" size={24} color="#fff" />
          <Text style={styles.roleText}>Vet Staff</Text>
        </TouchableOpacity>
      </View>
 
     
       {/* Sign Out Button */}
    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
      <Text style={styles.signOutButtonText}>Sign Out</Text>
    </TouchableOpacity>
    </View>
  );
}




// If the user is logged in and has selected a role, show the main content
return (
  <ScrollView contentContainerStyle={styles.container}>
    {/* Header and Role Info */}
    <View style={styles.topSection}>
      <Text style={styles.header}>Rescue365</Text>
      <Text style={styles.subheader}>
        Your Role: {role.charAt(0).toUpperCase() + role.slice(1)}
      </Text>
    </View>




    {/* Render content based on the selected role */}
    {role === 'bystander' && (
      <>
      <Text style={styles.label}>Animal Type:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter animal type (e.g., dog, cat)"
        value={animalType}
        onChangeText={setAnimalType}
      />




      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Brief description of the situation"
        value={description}
        onChangeText={setDescription}
      />




      <TouchableOpacity style={styles.actionButton} onPress={getLocation}>
        <Text style={styles.actionButtonText}>Get Location</Text>
      </TouchableOpacity>




      {location && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Rescue Location"
              description={location.address} // Show address in the marker
            />
          </MapView>
          <Text style={styles.location}>
            {location.address || "Address not available"}
          </Text>
        </>
      )}




      <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
        <Text style={styles.actionButtonText}>Upload a Photo</Text>
      </TouchableOpacity>




      {image && <Image source={{ uri: image }} style={styles.image} />}




      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#3b7d3c' }]}
        onPress={submitRescueReport}
      >
        <Text style={styles.actionButtonText}>Submit Rescue Report</Text>
      </TouchableOpacity>
    </>
  )}




    {role === 'rescuer' && (
      <View style={{ alignItems: 'center', width: '100%' }}>
      <Text style={styles.header}>Nearby Rescue Reports</Text>
      {rescueReports.length === 0 ? (
        <Text>No rescue reports within 10 miles of your location.</Text>
      ) : (
        <ScrollView style={{ width: '100%' }}>
          {rescueReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={[
                styles.reportCard,
                selectedReport?.id === report.id ? { backgroundColor: '#dff0d8' } : {},
              ]}
              onPress={() => setSelectedReport(report)} // Select the report
            >
              <Text style={styles.label}>Animal Type: {report.animal_type}</Text>
              <Text>Description: {report.description}</Text>
              <Text>Location: {report.address || "Address not available"}</Text>
              {report.image_url && <Image source={{ uri: report.image_url }} style={styles.image} />}




              {selectedReport?.id === report.id && (
                <View>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => confirmRescue(report)}
                  >
                    <Text style={styles.actionButtonText}>Navigate to Location</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => updateRescueStatus(report.id, "Rescue In Progress")}
                  >
                    <Text style={styles.actionButtonText}>Mark as In Progress</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#3b7d3c' }]}
                    onPress={() => updateRescueStatus(report.id, "Rescue Complete")}
                  >
                    <Text style={styles.actionButtonText}>Mark as Complete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}




      {selectedReport && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>
            You have selected a report!
          </Text>
          <Text>Animal Type: {selectedReport.animal_type}</Text>
          <Text>Description: {selectedReport.description}</Text>
          <Text>Location: {selectedReport.address}</Text>
        </View>
      )}
    </View>
  )}




    {role === 'vet' && (
       <View style={{ alignItems: 'center', width: '100%' }}>
       <Text style={styles.header}>In-Progress Rescue Reports</Text>
       {rescueReports.length === 0 ? (
         <Text>No rescue reports currently in progress.</Text>
       ) : (
         <ScrollView style={{ width: '100%' }}>
           {rescueReports.map((report) => (
             <TouchableOpacity
               key={report.id}
               style={styles.reportCard}
               onPress={() => setSelectedReport(report)}
             >
               <Text style={styles.label}>Animal Type: {report.animal_type}</Text>
               <Text>Description: {report.description}</Text>
               <Text>Location: {report.address || "Address not available"}</Text>




               {selectedReport?.id === report.id && (
                 <TouchableOpacity
                   style={[styles.actionButton, { backgroundColor: '#3b7d3c' }]}
                   onPress={() => updateRescueStatus(report.id, "Rescue Complete")}
                 >
                   <Text style={styles.actionButtonText}>Mark as Complete</Text>
                 </TouchableOpacity>
               )}
             </TouchableOpacity>
           ))}
         </ScrollView>
       )}
     </View>
   )}


    <TouchableOpacity style={styles.changeRoleButton} onPress={() => setRole(null)}>
      <Text style={styles.changeRoleText}>Change Role</Text>
    </TouchableOpacity>
  </ScrollView>
);
}


const styles = StyleSheet.create({
  // Sign-In Page Styles
  signInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8f5',
    padding: 20,
  },
  signInHeader: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3b7d3c',
    marginBottom: 10,
  },
  signInSubheader: {
    fontSize: 18,
    color: '#4a4a4a',
    marginBottom: 40,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a4a4a',
  },




  // General App Styles
  topSection: {
    marginTop: 40, // Move the header and role info down
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8f5',
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b7d3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 20,
    color: '#4a4a4a',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#4a4a4a',
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#c4c4c4',
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 15,
  },
  map: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    marginTop: 15,
    borderRadius: 8,
  },
  location: {
    fontSize: 16,
    color: '#3b7d3c',
    marginVertical: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  roleButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#3b7d3c',
    borderRadius: 8,
    width: '30%',
  },
  roleText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: '#6bbf59',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeRoleButton: {
    marginTop: 20,
  },
  changeRoleText: {
    color: '#3b7d3c',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 15,
  },
  reportCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  // Sign Out Button Styles
  signOutButton: {
    backgroundColor: '#e57373', // A softer red color
    paddingVertical: 10, // Smaller padding
    paddingHorizontal: 25, // Smaller padding
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 60, // Move the button lower
    marginBottom: 20,
    alignSelf: 'center', // Center the button horizontally
    width: '40%', // Make the button smaller
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 14, // Smaller font size
    fontWeight: 'bold',
  },
});
