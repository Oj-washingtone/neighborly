import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* Create custom header, with notification bell on the right and logo in the left */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Logo</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerText}>Bell</Text>
        </View>
      </View>

      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
