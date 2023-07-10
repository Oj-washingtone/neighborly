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

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
// import HomeTopTab from "../navigation/homeTopTab";
import { MaterialCommunityIcons } from "react-native-vector-icons";

// screens
import ForYouScreen from "./forYouScreen";
import MyJobs from "./myJobs";

const Tab = createMaterialTopTabNavigator();

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* Create header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* logo */}
          <View style={styles.logo}>
            <Text style={styles.logoText}>workit</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {/* Bell notification button */}
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarLabel: ({ focused }) => {
              let label =
                route.name.charAt(0).toUpperCase() +
                route.name.slice(1).toLowerCase();
              return (
                <Text
                  style={[
                    { color: focused ? "#000" : "#ccc" },
                    styles.tablabel,
                  ]}
                >
                  {label}
                </Text>
              );
            },
            tabBarIndicatorStyle: styles.tabIndicator,
          })}
        >
          <Tab.Screen name="For You" component={ForYouScreen} />
          <Tab.Screen name="From you" component={MyJobs} />
        </Tab.Navigator>
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

  header: {
    backgroundColor: "#fff",
    width: "100%",
    height: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    elevation: 5,
  },

  content: {
    flex: 1,
    width: "100%",
  },

  tablabel: {
    // fontSize: 16,
    fontWeight: 400,
  },

  tabIndicator: {
    backgroundColor: "#02d5c9",
    height: 1.5,
  },

  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});
