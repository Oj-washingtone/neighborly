import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  ScrollView,
  Image,
  Switch,
  SkeletonContent,
} from "react-native";

import { MaterialCommunityIcons } from "react-native-vector-icons";
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
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { UserContext } from "../navigation/index";
import { useNavigation } from "@react-navigation/native";
import JobItemSkeleton from "./components/jobSckeleton";

export default function ForYouScreen() {
  const user = useAuthentication();
  const userId = user?.uid;
  const navigation = useNavigation();

  const [taskCategories, setTaskCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [availableForWork, setAvailableForWork] = useState(true);
  const [isLoadingJob, setIsLoadingJob] = useState(true);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const docRef = doc(db, "users", userId);
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

    getUserDetails();
  }, [userId]);

  const toggleSwitch = () => {
    setAvailableForWork((previousState) => !previousState);
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const handleMoreDetails = () => {
    setIsExpanded(!isExpanded);
  };

  console.log("selectedCategories:", selectedCategories);
  return (
    <View style={styles.container}>
      <View style={styles.setAvailability}>
        <View style={styles.availabilityIcon}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={40}
            color="#02d5c9"
          />
        </View>

        <View style={styles.availability}>
          <Text style={styles.greetings}>Hello, {userDetails.userName}</Text>
          <Text
            style={[
              styles.status,
              availableForWork ? styles.availableText : styles.unavailableText,
            ]}
          >
            {availableForWork ? "Available for work" : "Not available for work"}
          </Text>
        </View>
        <View style={styles.switch}>
          <Switch
            trackColor={{ false: "#767577", true: "#02d5c9" }}
            thumbColor={availableForWork ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={availableForWork}
          />
        </View>
      </View>
      {availableForWork ? (
        <View style={styles.jobList}>
          <Text style={styles.title}>Available Job</Text>
          {isLoadingJob ? (
            <JobItemSkeleton />
          ) : (
            <View style={styles.jobItemWrapper}>
              <View style={styles.jobItem}>
                <View style={styles.jobDp}>
                  <Text>DP</Text>
                </View>
                <View style={styles.jobParticulars}>
                  <Text style={styles.name}>Washingtone - (Job - Laundry)</Text>
                  <View style={styles.detailsWrapper}>
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={18}
                      color="#02d5c9"
                    />
                    <Text style={styles.location}>Location</Text>
                  </View>
                  <View style={styles.detailsWrapper}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color="#02d5c9"
                    />
                    <Text style={styles.time}>Date time</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.acceptJobBtn}
                    onPress={handleMoreDetails}
                  >
                    <Text style={styles.acceptJobBtnText}>Accept job</Text>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.details}>
                      <Text style={styles.detailsTitle}>Details.</Text>
                      <Text style={styles.detailsText}>Job details...</Text>
                    </View>
                  )}
                  <View style={styles.JobAction}>
                    <TouchableOpacity
                      style={styles.moreBtn}
                      onPress={handleMoreDetails}
                    >
                      <Text style={styles.moreBtnText}>
                        {isExpanded ? "Less details..." : "More details..."}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.budget}>
                  <Text style={styles.currency}>KES.</Text>
                  <Text style={styles.amount}>2000</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.notAvailable}>
          <Text style={styles.title}>Not available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
  },

  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  categoryButton: {
    backgroundColor: "#f2f3f5",
    padding: 7,
    margin: 7,
    borderRadius: 10,
  },

  selectedCategoryButton: {
    backgroundColor: "#a2faf5",
  },

  workCategoryTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 30,
  },

  workCategoryWrapper: {
    width: "100%",
    marginTop: 20,
    paddingVertical: 20,
  },

  greetings: {
    fontWeight: "bold",
    color: "#000",
  },

  intro: {
    fontSize: 15,
    fontWeight: 500,
  },

  setAvailability: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
    elevation: 5,
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    fontSize: 11,
    marginTop: 3,
  },

  availabilityIcon: {
    width: "12%",
  },

  availability: {
    width: "60%",
  },

  availableText: {
    color: "gray",
  },
  unavailableText: {
    color: "red",
  },

  jobList: {
    width: "100%",
    height: "100%",
  },

  title: {
    fontWeight: 500,
    marginTop: 10,
  },

  notAvailable: {
    width: "100%",
    // backgroundColor: "red",
  },

  jobItemWrapper: {
    elevation: 2,
    backgroundColor: "#fff",
    marginVertical: 10,
    padding: 7,
    borderRadius: 5,
  },

  jobItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  jobDp: {
    width: 55,
    height: 55,
    backgroundColor: "#f2f3f5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 55 / 2,
  },

  jobParticulars: {
    width: "60%",
  },

  name: {
    fontSize: 12,
    fontWeight: "bold",
  },

  location: {
    fontSize: 12,
    marginLeft: 5,
  },

  time: {
    fontSize: 12,
    marginLeft: 5,
  },

  currency: {
    fontWeight: "bold",
    color: "#02d5c9",
    textAlign: "center",
  },

  amount: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: 500,
  },

  detailsWrapper: {
    flexDirection: "row",
    marginTop: 5,
  },

  JobAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 15,
  },
  // moreBtn: {
  //   padding: 10,
  // },

  moreBtnText: {
    fontSize: 13,
  },

  details: {
    width: "100%",
    alignSelf: "flex-end",
    marginTop: 20,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },

  acceptJobBtn: {
    backgroundColor: "#02D5C9",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    width: "50%",
    alignItems: "center",
  },

  acceptJobBtnText: {
    color: "#fff",
    fontSize: 12,
  },
});
