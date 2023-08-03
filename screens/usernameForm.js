import React, { useState, useRef, useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { db } from "../config/firebase";
import {
  collection,
  where,
  query,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { UserContext } from "../navigation/index";
import * as Location from "expo-location";

export default function UsernameForm() {
  const user = useAuthentication();
  const userId = user?.uid;
  const navigation = useNavigation();

  const [waiting, setWaiting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const [username, setUsername] = useState("");
  const { userDetails, setUserDetails } = useContext(UserContext);
  const handleAllowLocation = async () => {
    try {
      setWaiting(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setUserLocation(location);
      } else {
        alert("Permission Denied", "Location access was not granted.");
        setWaiting(false);
      }
    } catch (error) {
      console.error("Error requesting location access:", error);
      setWaiting(false);
    } finally {
      setWaiting(false);
    }
  };

  // call for location
  useEffect(() => {
    handleAllowLocation();
  }, []);

  useEffect(() => {
    // This useEffect will run whenever userLocation changes
    if (userLocation) {
      try {
        const docRef = doc(db, "users", userId);
        setDoc(
          docRef,
          {
            userLocation: userLocation,
          },
          { merge: true }
        );
        setWaiting(false);
      } catch (error) {
        console.log(error);
      }
    }
  }, [userLocation]);

  const handleSaveUsername = async () => {
    try {
      setWaiting(true);
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { userName: username }, { merge: true });
      //   update the details stored in the context

      navigation.navigate("Profile Picture Update");
    } catch (error) {
      console.error("Error updating username:", error);
    } finally {
      setWaiting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.logoWrapper}>
        <View style={styles.logo}>
          <MaterialCommunityIcons name="alpha-w" size={60} color="#000" />
          <Text style={styles.logoText}>workit</Text>
        </View>
        <Text style={styles.tagline}>
          Creating oppotunities, empowering people
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.userInfo}>Update your username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor="#aaaaaa"
          value={username}
          onChangeText={setUsername}
        />

        <TouchableOpacity style={styles.button} onPress={handleSaveUsername}>
          {waiting ? (
            <Text style={styles.buttonTitle}>Please wait...</Text>
          ) : (
            <Text style={styles.buttonTitle}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  formContainer: {
    flex: 3,
    width: "80%",
  },

  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#02d5c9",
  },

  button: {
    backgroundColor: "#02d5c9",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 10,
    padding: 7,
  },

  buttonTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  userInfo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
  logo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#02d5c9",
  },

  tagline: {
    fontSize: 9,
    color: "#000",
    textAlign: "center",
    fontStyle: "italic",
  },

  logoWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
  },
});
