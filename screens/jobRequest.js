import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Vibration,
  Image,
} from "react-native";

import { Audio } from "expo-av";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function JobCall() {
  const navigation = useNavigation();

  const [ringtoneSound, setRingtoneSound] = useState(null);
  const [rippleAnimation] = useState(new Animated.Value(0));
  let vibrationTimeout;

  useEffect(() => {
    const startVibration = () => {
      Vibration.vibrate([500, 500, 500], { interval: 1000, repeat: true });
      vibrationTimeout = setTimeout(() => {
        Vibration.cancel();
      }, 30000); // Stop vibration after 30 seconds
    };

    startVibration();

    return () => {
      Vibration.cancel();
      clearTimeout(vibrationTimeout);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      startRippleAnimation();
    }, 1100); // Adjust the interval duration as per your preference

    return () => {
      clearInterval(interval);
    };
  }, []);

  const startRippleAnimation = () => {
    rippleAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(rippleAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(rippleAnimation, {
        toValue: 2,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start(() => {
      rippleAnimation.setValue(0);
    });
  };

  const getRippleStyle = () => {
    const scale = rippleAnimation.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 4],
    });

    const opacity = rippleAnimation.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0.5, 0.3, 0],
    });

    return {
      position: "absolute",
      backgroundColor: "#03fce3",
      width: 150,
      height: 150,
      borderRadius: 150 / 2,
      transform: [{ scale }],
      opacity,
    };
  };

  // accept job
  const acceptJob = async () => {
    // stop vibration
    Vibration.cancel();
    // navigate to job details screen and remove this screen from stack
    navigation.replace("Job Details");
  };

  // reject job
  const rejectJob = async () => {
    // stop vibration
    Vibration.cancel();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.dpContainer}>
        <View style={styles.dp}>
          <Image
            source={require("../assets/dps/my_dp.jpg")}
            style={styles.dpImage}
          />
        </View>
        <Animated.View style={getRippleStyle()} />
      </View>
      <Text style={styles.name}>Washingtone Jalang'O</Text>
      <Text
        style={{
          fontSize: 16,
          color: "#000",
          marginBottom: 20,
        }}
      >
        Incoming job offer
      </Text>

      <Text>
        <Text style={{ fontWeight: "bold" }}>Job type: </Text>
        <Text>Washing</Text>
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#000",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>Location: </Text>
        <Text>Westlands</Text>
      </Text>

      <View style={styles.buttonContainer}>
        <View>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={rejectJob}
            activeOpacity={0.5}
          >
            <MaterialCommunityIcons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.buttonText}>Decline</Text>
        </View>
        <View>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={acceptJob}
            activeOpacity={0.5}
          >
            <MaterialCommunityIcons name="check" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.buttonText}>Accept</Text>
        </View>
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
    paddingHorizontal: 20,
  },
  dpContainer: {
    position: "relative",
  },
  dp: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 150 / 2,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    marginBottom: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    // fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  rejectButton: {
    backgroundColor: "#ed4746",
  },
  acceptButton: {
    backgroundColor: "#18f58a",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 40,
  },

  dpImage: {
    width: "100%",
    height: "100%",
    borderRadius: 150 / 2,
  },
});
