import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// icons
import { MaterialCommunityIcons } from "react-native-vector-icons";

// import screens
import Home from "../screens/home";
import Profile from "../screens/profile";
import Messages from "../screens/messages";
import Search from "../screens/search";

const Tab = createBottomTabNavigator();

export default function MainNavigation() {
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
            iconName = focused ? "account" : "account-outline";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#f52230",
        tabBarInactiveTintColor: "#000",
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
