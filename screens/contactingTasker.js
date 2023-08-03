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
import { db } from "../config/firebase";
import {
  collection,
  where,
  query,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { Audio } from "expo-av";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthentication } from "../utils/hooks/useAuthentication";

export default function ContactTasker({ route }) {
  const user = useAuthentication();
  const userId = user?.uid;

  const { jobDetails, taskerId } = route.params;

  const navigation = useNavigation();

  const [ringtoneSound, setRingtoneSound] = useState(null);
  const [rippleAnimation] = useState(new Animated.Value(0));
  let vibrationTimeout;
  const [noResponse, setNoResponse] = useState(false);

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
    // navigate backwards
    navigation.goBack();
  };

  // play ringtone
  const playRingtone = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/tones/ringtone.mp3"),
      { shouldPlay: true, isLooping: true }
    );
    setRingtoneSound(sound);
  };

  // get the details of the tasker from firestore

  const [taskerDetails, setTaskerDetails] = useState(null);
  useEffect(() => {
    const getTaskerDetails = async () => {
      const taskerRef = doc(db, "users", taskerId);
      const taskerSnap = await getDoc(taskerRef);
      if (taskerSnap.exists()) {
        const taskerData = taskerSnap.data();
        setTaskerDetails(taskerData);
      } else {
        console.log("No such document!");
      }
    };

    getTaskerDetails();
  }, [taskerId]);

  // listen for tasker response (check if has job request has turned to false )
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", userId),
      (doc) => {
        const data = doc.data();
        if (data?.hasJobRequest === false) {
          // navigate to job details screen and remove this screen from stack
          // navigation.replace("Job Details");
          alert("Tasker has rejected your request");
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logo}>
        {/* <Image
          source={require("../assets/platform/logo.png")}
          style={styles.logoImage}
          // cover
        /> */}
      </View>
      <View style={styles.dpContainer}>
        <View style={styles.dp}>
          <Image
            source={require("../assets/dps/my_dp.jpg")}
            style={styles.dpImage}
          />
        </View>
        <Animated.View style={getRippleStyle()} />
      </View>

      <Text style={styles.name}>{taskerDetails?.userName}</Text>
      <Text
        style={{
          fontSize: 16,
          color: "#000",
          //   marginTop: 20,
        }}
      >
        Waiting for response...
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={rejectJob}
          activeOpacity={0.5}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
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

  buttonText: {
    color: "#fff",
    fontSize: 16,
    // fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  rejectButton: {
    backgroundColor: "#ed4746",
    width: "90%",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },

  acceptButton: {
    backgroundColor: "#18f58a",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },

  dpImage: {
    width: "100%",
    height: "100%",
    borderRadius: 150 / 2,
  },

  logo: {
    // flex: 0.5,
    // width: 150,
    // height: 150,
    // marginBottom: 40,
    // cover
  },

  logoImage: {
    width: 100,
    aspectRatio: 1,
    height: "auto",
    resizeMode: "contain",
  },
});
