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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

export default function MyJobs() {
  const navigation = useNavigation();

  // open job post form screen
  const openJobPostForm = () => {
    navigation.navigate("Post Job");
  };
  return (
    <View style={styles.container}>
      <View style={styles.noJobWrapper}>
        <Image
          source={require("../assets/images/app_image1.png")}
          style={styles.nojobImage}
        />
        <Text style={styles.noJobListingInfo}>
          You have not posted any opening yet, your posts will appear here
        </Text>
      </View>

      {/* Floating action button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openJobPostForm}
        activeOpacity={0.5}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
  },

  fab: {
    position: "absolute",
    width: 45,
    height: 45,
    backgroundColor: "#02d5c9",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 45 / 2,
    bottom: 20,
    right: 20,
    elevation: 5,
  },

  nojobImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },

  noJobListingInfo: {
    fontWeight: "500",
    textAlign: "center",
  },

  noJobWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
