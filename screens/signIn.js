import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig, app } from "../config/firebase";
import {
  PhoneAuthProvider,
  getAuth,
  signInWithCredential,
} from "firebase/auth";
import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "react-native-vector-icons";

export default function SignIn() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const [showCodeInput, setShowCodeInput] = useState(false); // Track whether to show code input or not
  const [verifying, setVerifying] = useState(false);

  const sendVerification = () => {
    const phoneProvider = new PhoneAuthProvider(getAuth(app));

    phoneProvider
      .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
      .then(setVerificationId)
      .then(() => setShowCodeInput(true))
      .catch((error) => {
        console.log(error);
        alert("Failed to send verification code. Please try again.");
      });

    // setPhoneNumber("");
  };

  const confirmCode = async () => {
    setVerifying(true);
    const credential = PhoneAuthProvider.credential(verificationId, code);

    signInWithCredential(getAuth(app), credential)
      .then((result) => {
        // Handle successful sign-in
        console.log(result);
        setCode("");

        // Store the user token in AsyncStorage
        const userToken = result.user.uid;
        AsyncStorage.setItem("userToken", userToken);

        try {
          // create user in firestore
          const userRef = doc(db, "users", userToken);
          setDoc(userRef, {
            phoneNumber: result.user.phoneNumber,
            userName: "",
            userPhoto: "",
            userBio: "",
            userLocation: "",
            userSkills: [],
            userJobs: [],
            userRating: 0,
            userReviews: [],
            userNotifications: [],
            messages: [],
            currentWorkingJob: "",
            availableForWork: false,
            currentlyWorking: false,
            paymentRate: "",
            hasJobRequest: false,
          });
        } catch (error) {
          console.log("Error creating user: ", error);
        }
      })
      .catch((error) => {
        // Handle sign-in error
        alert(error.message);
      });
  };

  const handleNewNumber = () => {
    setShowCodeInput(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logoWrapper}>
        <View style={styles.logo}>
          <MaterialCommunityIcons name="alpha-w" size={60} color="#000" />
          <Text style={styles.logoText}>workit</Text>
        </View>
      </View>
      {!showCodeInput && ( // Render the code input if showCodeInput is true}
        <View style={styles.onboarding}>
          <Image
            source={require("../assets/images/onboarding.png")}
            style={styles.onboardingImage}
          />
          <Text style={[styles.onboardingText, { marginTop: 20 }]}>
            {" "}
            Find work opportunities
          </Text>
          <Text style={[styles.onboardingText, styles.onboardingText2]}>
            {" "}
            and hire talented individuals
          </Text>
          <Text style={styles.onboardingText}>near you </Text>
        </View>
      )}

      {showCodeInput && (
        <View style={styles.onboarding}>
          <Text style={[styles.onboardingText, { marginTop: 20 }]}>
            {" "}
            Enter verification code
          </Text>
          <Text style={[styles.onboardingText, styles.onboardingText2]}>
            {" "}
            to verify
          </Text>
          <Text style={styles.onboardingText}>{phoneNumber}</Text>
        </View>
      )}

      {showCodeInput ? ( // Render the code input if showCodeInput is true
        <View style={styles.inputView}>
          <TextInput
            placeholder="Enter Verification Code"
            onChangeText={setCode}
            keyboardType="number-pad"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button2} onPress={handleNewNumber}>
            <Text style={styles.buttonText2}>Use different number</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            {verifying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify phone number</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        // Render the phone input and send verification button if showCodeInput is false
        <View style={styles.inputView}>
          <TextInput
            placeholder="Phone Number"
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={sendVerification}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.tagline}>
        Creating oppotunities, empowering people
      </Text>

      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        style={styles.recaptcha}
      />
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
  inputView: {
    width: "100%",
    // height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },

  button: {
    width: "80%",
    padding: 7,
    margin: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#02d5c9",
    borderRadius: 10,
  },

  recaptcha: {
    alignSelf: "center", // Center the reCAPTCHA container horizontally
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  onboardingText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  onboardingText2: {
    color: "#02d5c9",
  },

  onboardingImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  onboarding: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    marginTop: 30,
  },

  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#02d5c9",
  },

  tagline: {
    fontSize: 9,
    color: "#000",
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonText2: {
    color: "#02d5c9",
    fontWeight: "bold",
  },
  button2: {
    maeginVertical: 20,
  },
});
