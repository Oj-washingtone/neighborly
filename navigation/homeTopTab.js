import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";

// screens
import ForYouScreen from "../screens/forYouScreen";
import MyJobs from "../screens/myJobs";

const Tab = createMaterialTopTabNavigator();

export default function HomeTopTab() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen name="For You" component={ForYouScreen} />
        <Tab.Screen name="My Jobs" component={MyJobs} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
