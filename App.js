import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

import * as NavigationBar from "expo-navigation-bar";

// screens
import AppNavigator from "./navigation/index";

export default function App() {
  // change android navigation color
  NavigationBar.setBackgroundColorAsync("#fff");
  // change android navigation buttons color
  NavigationBar.setButtonStyleAsync("dark");

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
