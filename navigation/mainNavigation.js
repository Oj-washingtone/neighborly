import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// icons
import { MaterialCommunityIcons } from "react-native-vector-icons";

// import screens
import Home from "../screens/home";
import Profile from "../screens/profile";
import Messages from "../screens/messages";
import Search from "../screens/search";
import { UserContext } from "./index";
import React, { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  where,
  query,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuthentication } from "../utils/hooks/useAuthentication";

const Tab = createBottomTabNavigator();

export default function MainNavigation() {
  const user = useAuthentication();
  const userId = user?.uid;
  const [userDetails, setUserDetails] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const docRef = doc(db, "users", userId);
        onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log("No such document!");
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    getUserDetails();
  }, [userId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (userDetails.userName === "") {
        navigation.navigate("Username form"); // Redirect to the "UsernameForm" screen
      }
    }, 5000); // 5-second delay

    return () => clearTimeout(timeoutId);
  }, [userDetails.userName, navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "magnify" : "magnify";
          } else if (route.name === "Messages") {
            iconName = focused ? "message" : "message-outline";
          } else if (route.name === "Profile") {
            iconName = focused
              ? "account-circle-outline"
              : "account-circle-outline";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#02d5c9",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 3,
          shadowOpacity: 0,
          shadowOffset: {
            height: 0,
          },
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
