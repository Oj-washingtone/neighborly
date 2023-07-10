/**
 * Handles app wide navigation, connects auth stack and user stack
 */
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
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
import { getAuth, signOut } from "firebase/auth";

// import AuthStack from "./authStack";
import UserStack from "./userStack";
import AuthStack from "./authStack";

export const UserContext = React.createContext();

export default function AppNavigator() {
  const user = useAuthentication();
  const auth = getAuth();
  const userId = user?.uid;

  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      getUserDetails();
    }
  }, [userId]);

  return (
    <UserContext.Provider value={userDetails}>
      {user ? <UserStack /> : <AuthStack />}
    </UserContext.Provider>
  );
}

/**
 * This component uses the useAuthentication hook to determine
 * whether we have a logged-in user or not, and based on that,
 * it loads one of the two application stacks.
 */
