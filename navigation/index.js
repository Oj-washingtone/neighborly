/**
 * Handles app wide navigation, connects auth stack and user stack
 */
import { StyleSheet, View, Text } from "react-native";

import { useAuthentication } from "../utils/hooks/useAuthentication";

// import AuthStack from "./authStack";
import UserStack from "./userStack";
import AuthStack from "./authStack";

export default function AppNavigator() {
  const user = useAuthentication();

  return user ? <UserStack /> : <AuthStack />;
}

/**
 * This component uses the useAuthentication hook to determine
 * whether we have a logged-in user or not, and based on that,
 * it loads one of the two application stacks.
 */
