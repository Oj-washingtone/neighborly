import React, { useState, useRef } from "react";
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
import * as Location from "expo-location";
import {
  collection,
  where,
  query,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useAuthentication } from "../utils/hooks/useAuthentication";

export default function LocationAccess() {
  const user = useAuthentication();
  const userId = user?.uid;
  const [waiting, setWaiting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const handleAllowLocation = async () => {
    try {
      setWaiting(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setUserLocation(location);
        await updateLocation();
        setWaiting(false);
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

  // update location in firestore
  const updateLocation = async () => {
    try {
      const docRef = doc(db, "users", userId);
      await setDoc(
        docRef,
        {
          location: userLocation,
        },
        { merge: true }
      );

      alert("Location updated successfully");
    } catch (error) {
      console.log(error);
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
        <MaterialCommunityIcons
          name="map-marker-radius"
          size={100}
          color="#02d5c9"
        />
        <Text style={styles.userInfo}>
          To enable us personalize your experience, allow us to access your
          location
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAllowLocation}
          disabled={waiting}
        >
          {waiting ? (
            <Text style={styles.buttonTitle}>
              <ActivityIndicator color="#fff" /> Please wait..
            </Text>
          ) : (
            <Text style={styles.buttonTitle}>Allow</Text>
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
    alignItems: "center",
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
    marginTop: 40,
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

  userInfo: {
    fontSize: 13,
    fontWeight: 400,
    marginTop: 30,
    textAlign: "center",
  },
});
