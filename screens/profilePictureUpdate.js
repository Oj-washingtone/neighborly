import React, { useState, useRef, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Image,
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
import * as ImagePicker from "expo-image-picker";
import { storage } from "../config/firebase";

export default function ProfilePictureUpdate() {
  const user = useAuthentication();
  const userId = user?.uid;
  const navigation = useNavigation();

  const [waiting, setWaiting] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSaveDP = async () => {
    try {
      setWaiting(true);

      // Upload the image to Firebase Storage
      // const response = await fetch(profilePicture);

      // console.log(response);
      // const blob = await response.blob();
      // const storageRef = storage.ref().child(`profilePictures/${userId}`);
      // await storageRef.put(blob);

      // // Get the download URL of the uploaded image
      // const downloadURL = await storageRef.getDownloadURL();

      // // Update the user document in Firestore with the image URL
      // const userRef = doc(db, "users", userId);
      // await setDoc(userRef, { userPhoto: downloadURL }, { merge: true });

      navigation.navigate("User Prerefrences");
    } catch (error) {
      console.error("Error updating profile picture:", error);
    } finally {
      setWaiting(false);
    }
  };

  const handleSelectProfilePicture = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permission to access media library is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      if (!pickerResult.canceled) {
        const selectedImage = pickerResult.assets[0];
        setProfilePicture(selectedImage.uri);
      }
    } catch (error) {
      console.error("Error selecting profile picture:", error);
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
        <Text style={styles.userInfo}>Update Profile picture</Text>
        <View style={styles.imagePreview}>
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.previewImage}
            />
          ) : (
            <MaterialCommunityIcons name="account" size={100} color="#ccc" />
          )}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleSelectProfilePicture}
          >
            <MaterialCommunityIcons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveDP}>
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

  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#f2f3f5",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },

  cameraButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#02d5c9",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
