import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthentication } from "../utils/hooks/useAuthentication";
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
import { MaterialCommunityIcons } from "react-native-vector-icons";

export default function TaskerDetails({ route }) {
  const navigation = useNavigation();
  const user = useAuthentication();
  const userId = user?.uid;

  const { jobDetails, taskerId, timeAway } = route.params;
  const [taskerDetails, setTaskerDetails] = useState(null);
  const [contactingTasker, setContactingTasker] = useState(false);
  const [showWorkWithMe, setShowWorkWithMe] = useState(true);
  const [canselingRequest, setCanselingRequest] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "", // Set your custom title here
    });
  }, [navigation]);

  useEffect(() => {
    // Fetch initial tasker details
    const fetchTaskerDetails = async () => {
      try {
        const taskerRef = doc(db, "users", taskerId);
        const taskerSnap = await getDoc(taskerRef);
        if (taskerSnap.exists()) {
          const taskerData = taskerSnap.data();
          setTaskerDetails(taskerData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching tasker details:", error);
      }
    };

    // Start listening for changes to the tasker details
    const unsubscribe = onSnapshot(
      doc(db, "users", taskerId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const taskerData = docSnapshot.data();
          setTaskerDetails(taskerData);

          if (taskerData.hasJobRequest) {
            if (jobDetails?.userId === userId) {
              setShowWorkWithMe(false);
            }
          }
        } else {
          console.log("No such document!");
          setTaskerDetails(null);
        }
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [taskerId]);

  const handleWorkWithMe = async (taskerId) => {
    setContactingTasker(true);
    try {
      // set hasJobRequest to true
      const taskerRef = doc(db, "users", taskerId);
      await setDoc(
        taskerRef,
        {
          hasJobRequest: true,
        },
        { merge: true }
      );

      // add taskerId to jobDetails as contactedTasker
      const jobRef = doc(db, "jobposts", jobDetails.taskId.toString());

      await setDoc(
        jobRef,
        {
          contactedTasker: taskerId,
          status: "waiting for response",
        },
        { merge: true }
      );

      alert(
        `${taskerDetails?.userName} has been contacted. we sure hope they respond ASAP!`
      );

      setContactingTasker(false);
      setShowWorkWithMe(false);
    } catch (error) {
      console.error("Error setting hasJobRequest to true:", error);
    }
  };

  const handleCancelRequest = async () => {
    try {
      setCanselingRequest(true);
      // set hasJobRequest to false
      const taskerRef = doc(db, "users", taskerId);
      await setDoc(
        taskerRef,
        {
          hasJobRequest: false,
        },
        { merge: true }
      );

      // add taskerId to jobDetails as contactedTasker
      const jobRef = doc(db, "jobposts", jobDetails.taskId.toString());

      await setDoc(
        jobRef,
        {
          contactedTasker: "",
          status: "open",
        },
        { merge: true }
      );

      alert(
        `You have successfully cancelled your request to work with ${taskerDetails?.userName}`
      );

      setCanselingRequest(false);
      setShowWorkWithMe(true);
    } catch (error) {
      console.error("Error setting hasJobRequest to false:", error);
      setCanselingRequest(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.details}>
        <View style={styles.profilePicture}>
          <Text>p</Text>
        </View>
        <View style={styles.nameWrapper}>
          <Text style={styles.name}>{taskerDetails?.userName}</Text>
        </View>
        <View style={styles.location}>
          <MaterialCommunityIcons name="map-marker" size={20} color="black" />
          <Text style={styles.locationText}>{timeAway}</Text>
        </View>

        <View style={styles.skillsWrapper}>
          <Text style={styles.title}>My skills</Text>

          <View style={styles.skillsList}>
            {taskerDetails?.userSkills?.map((skill, index) => (
              <View style={styles.userSkillWrapper} key={index}>
                <Text style={styles.userSkill}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.reviewsWrapper}>
          <Text style={styles.title}>Endorsements</Text>
          <View style={styles.noEndorsement}>
            {/* Icon */}
            <MaterialCommunityIcons
              name="emoticon-sad-outline"
              size={50}
              color="#a9a9a9"
            />

            <Text style={styles.noEndorsementText}>
              Not endorsed by anyone yet
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {showWorkWithMe ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleWorkWithMe(taskerId)}
          >
            {contactingTasker ? (
              <View style={{ flexDirection: "row" }}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonText}>
                  Connecting, please wait...
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Work with me</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.buttonCancelRequest}
              onPress={handleCancelRequest}
            >
              {canselingRequest ? (
                <View style={{ flexDirection: "row" }}>
                  <ActivityIndicator size="small" color="#000" />
                  <Text style={{ color: "#000", marginLeft: 10 }}>
                    Cancelling request...
                  </Text>
                </View>
              ) : (
                <Text style={{ color: "red", marginTop: 10 }}>
                  Cancel request to work with {taskerDetails?.userName}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, { width: "60%" }]}>
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#000" }]}
                onPress={() => navigation.navigate("Home Screen")}
              >
                <MaterialCommunityIcons
                  name="home-outline"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.actionButtonText}>Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  },
  details: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f2f3f5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  buttonContainer: {
    width: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
  },

  button: {
    width: "100%",
    backgroundColor: "#02d5c9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  buttonText: {
    color: "#fff",
  },

  nameWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  userSkills: {
    width: "100%",
    marginTop: 20,
  },

  title: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 20,
  },

  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "center",
  },

  userSkill: {
    fontSize: 13,
    marginRight: 10,
    marginTop: 10,
  },

  location: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  locationText: {
    fontSize: 13,
    marginLeft: 5,
  },

  noEndorsement: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: 200,
  },

  noEndorsementText: {
    fontSize: 13,
    color: "#a9a9a9",
  },

  buttonCancelRequest: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginBottom: 30,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  actionButton: {
    width: "23%",
    backgroundColor: "#02d5c9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },

  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 5,
  },
});
