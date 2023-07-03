import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import * as NavigationBar from "expo-navigation-bar";

export default function App() {
  // change android navigation color
  NavigationBar.setBackgroundColorAsync("#fff");
  // change android navigation buttons color
  NavigationBar.setButtonStyleAsync("dark");

  return (
    <View style={styles.container}>
      <Text>Neighborly App</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
