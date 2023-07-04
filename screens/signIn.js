import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig, app } from "../config/firebase";
import {
  PhoneAuthProvider,
  getAuth,
  signInWithCredential,
} from "firebase/auth";

export default function SignIn() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const [showCodeInput, setShowCodeInput] = useState(false); // Track whether to show code input or not

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

    setPhoneNumber("");
  };

  const confirmCode = () => {
    const credential = PhoneAuthProvider.credential(verificationId, code);

    signInWithCredential(getAuth(app), credential)
      .then((result) => {
        // Handle successful sign-in
        console.log(result);
        setCode("");
      })
      .catch((error) => {
        // Handle sign-in error
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Sign In</Text>

      {showCodeInput ? ( // Render the code input if showCodeInput is true
        <View style={styles.inputView}>
          <TextInput
            placeholder="Enter Verification Code"
            onChangeText={setCode}
            keyboardType="number-pad"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text>Verify phone number</Text>
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
            <Text>Send Verification</Text>
          </TouchableOpacity>
        </View>
      )}

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
    height: "100%",
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
    height: 40,
    margin: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    borderRadius: 5,
  },

  recaptcha: {
    alignSelf: "center", // Center the reCAPTCHA container horizontally
    marginTop: 20,
  },
});
