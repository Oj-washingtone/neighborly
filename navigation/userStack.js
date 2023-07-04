import { StyleSheet, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import screens
import MainNavigation from "./mainNavigation";
import JobCall from "../screens/jobRequest";
import JobDetails from "../screens/jobDetails";

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
          name="JobCall"
          component={JobCall}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Job Details"
          component={JobDetails}
          //   options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
