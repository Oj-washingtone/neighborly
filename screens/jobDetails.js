import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import * as Location from "expo-location";
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

export default function JobDetails() {
  const route = useRoute();
  const jobDetails = route.params;

  const [userDetails, setUserDetails] = useState({});

  // alert the job details
  // alert(JSON.stringify(jobDetails));

  // get the user's location

  // retrieve user with taskerId

  useEffect(() => {
    const getUser = async () => {
      try {
        const docRef = doc(db, "users", jobDetails.contactedTasker);
        onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log("No such document!");
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [jobDetails.taskerId]);

  // alert(JSON.stringify(userDetails));

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.jobDetailsContainer}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="briefcase" size={24} color="#000" />
          <Text style={styles.jobTitle}>{jobDetails.jobTitle}</Text>
        </View>
        <View style={styles.jobDate}>
          <MaterialCommunityIcons
            name="calendar-month"
            size={24}
            color="#000"
          />

          <Text style={styles.jobDateText}>
            {jobDetails.taskDetails.date} {jobDetails.taskDetails.time}
          </Text>
        </View>

        <View style={styles.jobDescription}>
          <Text style={styles.jobDescriptionText}>
            {jobDetails.jobDescription}
          </Text>
        </View>

        <View style={styles.actionButtonsWrapper}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons
              name="pencil"
              size={24}
              color="#02d5c9"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons
              name="delete"
              size={24}
              color="red"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectedTaskerWrapper}>
          <Text style={styles.selectedTaskerText}>Selected Worker</Text>

          <View style={styles.selectedTasker}>
            <View style={styles.selectedTaskerHrader}>
              <View style={styles.selectedTaskerDp}>
                <Text>Dp</Text>
              </View>
              <View style={styles.location}>
                <Text style={styles.taskerName}>{userDetails.userName}</Text>
                {/* <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color="#000"
                /> */}
              </View>
            </View>

            <View style={styles.taskerActions}>
              <TouchableOpacity style={styles.taskerAction}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#02d5c9"
                />
                <Text style={styles.taskerActionText}>Cancel engagement</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  jobDetailsContainer: {
    width: "100%",
    padding: 20,
  },

  header: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 20,
  },

  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

  jobDate: {
    width: "100%",
    flexDirection: "row",
  },

  jobDateText: {
    // fontSize: 16,
    marginLeft: 10,
  },
  jobDescription: {
    width: "100%",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f2f3f5",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f3f5",
  },

  actionButtonsWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f3f5",
  },

  actionButton: {
    width: "40%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  selectedTaskerWrapper: {
    width: "100%",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f3f5",
  },

  selectedTaskerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 30,
  },

  selectedTaskerHrader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  selectedTaskerDp: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: "#f2f3f5",
    alignItems: "center",
    justifyContent: "center",
  },

  taskerName: {
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 10,
  },

  taskerAction: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f2f3f5",
    marginTop: 20,
  },
});
