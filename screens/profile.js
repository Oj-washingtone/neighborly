import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const navigation = useNavigation();

  const handleProfilePictureUpdate = () => {
    navigation.navigate("Username form");
  };
  // navigate t
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Profile</Text>
      {/* Buton to update profile picture */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleProfilePictureUpdate}
      >
        <Text>Update Profile Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
