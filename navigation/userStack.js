import { StyleSheet, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";

// import screens
import MainNavigation from "./mainNavigation";
import JobCall from "../screens/jobRequest";
import JobDetails from "../screens/jobDetails";
import JobPostForm from "../screens/jobPostForm";
import UsernameForm from "../screens/usernameForm";
import LocationAccess from "../screens/locationAccess";
import ProfilePictureUpdate from "../screens/profilePictureUpdate";
import Preferences from "../screens/preferences";

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home Screen"
          component={MainNavigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Post Job"
          component={JobPostForm}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobCall"
          component={JobCall}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Job Details"
          component={JobDetails}
          //   options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Username form"
          component={UsernameForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Location Access"
          component={LocationAccess}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Profile Picture Update"
          component={ProfilePictureUpdate}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="User Prerefrences"
          component={Preferences}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
