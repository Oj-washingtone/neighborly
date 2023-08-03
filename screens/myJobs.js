import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Image,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { db } from "../config/firebase";
import { collection, where, query, onSnapshot } from "firebase/firestore";
import { useAuthentication } from "../utils/hooks/useAuthentication";

export default function MyJobs() {
  const navigation = useNavigation();
  const user = useAuthentication();
  const userId = user?.uid;

  // open job post form screen
  const openJobPostForm = () => {
    navigation.navigate("Post Job");
  };

  // select all jobs that I have posted on snapshot
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedJobs, setGroupedJobs] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const getMyJobs = async () => {
      try {
        const q = query(
          collection(db, "jobposts"),
          where("userId", "==", userId)
        );
        onSnapshot(q, (querySnapshot) => {
          const myJobsData = [];
          querySnapshot.forEach((doc) => {
            myJobsData.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setMyJobs(myJobsData);
          setLoading(false);
        });
      } catch (error) {
        console.log(error);
      }
    };

    getMyJobs();
  }, [userId]);

  useEffect(() => {
    // Group the jobs by date and time
    const grouped = {};
    myJobs.forEach((job) => {
      const key = `${job.taskDetails.date} ${job.taskDetails.time}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(job);
    });

    // Convert the grouped object into an array of arrays
    const groupedJobsArray = Object.values(grouped);

    // Sort the grouped jobs in ascending order based on date and time
    groupedJobsArray.sort((a, b) => {
      // Assuming taskDetails.date and taskDetails.time are in the format "YYYY-MM-DD" and "HH:MM:SS"
      const dateA = new Date(
        `${a[0].taskDetails.date}T${a[0].taskDetails.time}`
      );
      const dateB = new Date(
        `${b[0].taskDetails.date}T${b[0].taskDetails.time}`
      );
      return dateA - dateB;
    });

    // Update the state with the sorted and grouped jobs
    setGroupedJobs(groupedJobsArray);
  }, [myJobs]);

  console.log(groupedJobs);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#02d5c9" />
      ) : groupedJobs.length === 0 ? (
        <View style={styles.noJobWrapper}>
          <Image
            source={require("../assets/images/app_image1.png")}
            style={styles.nojobImage}
          />
          <Text style={styles.noJobListingInfo}>
            You have not posted any opening yet, your posts will appear here
          </Text>
        </View>
      ) : (
        <View style={styles.jobsWrapper}>
          <Text>My Jobs</Text>
          {/* List of jobs */}
          <FlatList
            data={groupedJobs}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.jobWrapper}
                onPress={() => navigation.navigate("Job Details", item[0])}
              >
                <View style={styles.jobDetails}>
                  <View style={styles.jobIcon}>
                    <MaterialCommunityIcons
                      name="briefcase"
                      size={24}
                      color="#f24f86"
                    />
                  </View>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{item[0].jobTitle}</Text>
                    {/* date and time and status*/}
                    <View style={styles.jobDateStatus}>
                      <Text style={styles.jobDate}>
                        {item[0].taskDetails.date} {item[0].taskDetails.time}
                      </Text>
                      <Text style={styles.jobDate}>{item[0].status}</Text>
                    </View>
                  </View>
                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item[0].id} // Use the first job's id as the key
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      {/* Floating action button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openJobPostForm}
        activeOpacity={0.5}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
  },

  fab: {
    position: "absolute",
    width: 45,
    height: 45,
    backgroundColor: "#02d5c9",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 45 / 2,
    bottom: 20,
    right: 20,
    elevation: 5,
  },

  nojobImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },

  noJobListingInfo: {
    fontWeight: "500",
    textAlign: "center",
  },

  noJobWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  jobsWrapper: {
    flex: 1,
    width: "100%",
  },

  jobWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f3f5",
  },

  jobTitle: {
    fontWeight: 500,
    fontSize: 13,
  },

  jobDetails: {
    flexDirection: "row",
    alignItems: "center",
  },

  jobIcon: {
    backgroundColor: "#f2f3f5",
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
  },

  jobInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  jobDate: {
    fontSize: 12,
    color: "#a9a9a9",
  },

  jobDateStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 200,
  },
});
