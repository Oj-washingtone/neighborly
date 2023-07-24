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
  Platform,
  PanResponder,
  Animated,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "react-native-vector-icons";
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
import { useRoute } from "@react-navigation/native";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
// import sckeleton loader
import TakerSkeletonLoader from "./components/taskersSkeletonLoader";

export default function SelectTasker() {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobDetails } = route.params;
  const [mapRegion, setMapRegion] = useState(null);
  const [taskersHeight, setTaskersHeight] = useState(40); // Initial height of the Taskers view
  const taskersHeightAnim = useRef(new Animated.Value(40)).current;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Center the map on jobDetails.location
    if (jobDetails.location) {
      setMapRegion({
        latitude: jobDetails.location.latitude,
        longitude: jobDetails.location.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.01,
      });
    }
  }, [jobDetails.location]);

  const [taskers, setTaskers] = useState([
    {
      id: 1,
      name: "John Doe",
      rating: 4.5,
      price: 20,
      location: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    },
    {
      id: 5,
      name: "John Doe",
      rating: 4.5,
      price: 20,
      location: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    },
    {
      id: 2,
      name: "John Doe",
      rating: 4.5,
      price: 20,
      location: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    },
    {
      id: 3,
      name: "John Doe",
      rating: 4.5,
      price: 20,
      location: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    },
    {
      id: 4,
      name: "John Doe",
      rating: 4.5,
      price: 20,
      location: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    },
    {
      id: 6,
      name: "John Doe",
      rating: 4.5,
      price: 20,
      location: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    },
    {
      id: 7,
      name: "John Doe",
      rating: 4.5,
      price: 20,
      location: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    },
    {
      id: 8,
      name: "John Doe",
      rating: 4.5,
      price: 20,
      location: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    },
    {
      id: 9,
      name: "John Doe",
      rating: 4.5,
      price: 20,
      location: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    },
    {
      id: 10,
      name: "John Doe",
      rating: 4.5,
      price: 20,
      location: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    },
  ]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const jobTitle = jobDetails.jobTitle;

    const usersCollectionRef = collection(db, "users");
    const queryRef = query(
      usersCollectionRef,
      where("userSkills", "array-contains", jobTitle)
    );

    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        const user = doc.data();
        usersData.push(user);
      });

      // Update the state with the users data
      setUsers(usersData);

      // Set loading to false
      setLoading(false);
    });

    return () => unsubscribe();
  }, [jobDetails.jobTitle]);

  console.log(users);

  return (
    <View style={styles.container}>
      {mapRegion && (
        <MapView
          style={[styles.map, { height: "35%" }]}
          initialRegion={mapRegion}
          region={mapRegion}
          showsUserLocation={true}
        >
          {jobDetails.location && (
            <Marker
              coordinate={jobDetails.location}
              title="Job Location"
              description="This is the location for the job"
            />
          )}
        </MapView>
      )}
      <View style={[styles.taskers]}>
        <Text style={styles.taskerTitle}>People near you</Text>
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} // Placeholder data for skeleton loader
            keyExtractor={(item) => item.toString()}
            renderItem={() => <TakerSkeletonLoader />} // Render skeleton loader component
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskerItem}>
                <View style={styles.taskerDP}>{/* if no dp show icon */}</View>
                <View style={styles.taskerDetails}>
                  <View style={styles.taskerNameRating}>
                    <Text style={styles.taskerName}>{item.userName}</Text>
                    <View style={styles.taskerRating}>
                      <Text style={styles.taskerPrice}>
                        ${item.paymentRate}/hr
                      </Text>
                      <MaterialCommunityIcons
                        name="star"
                        size={15}
                        color="#FFD700"
                      />
                      <Text style={styles.taskerRatingText}>
                        {item.userRating}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.taskerPriceAction}>
                    <View style={styles.userLocation}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={15}
                        color="#02d5c9"
                      />
                      <Text style={styles.timeAwayText}>2 hours away</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.taskerButton}
                      // onPress={() => navigation.navigate("JobDetails")}
                    >
                      <Text style={styles.taskerButtonText}>Select</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.skipButton, { opacity: loading ? 0 : 1 }]}
        disabled={loading}
        // onPress={() => navigation.navigate("JobDetails")}
      >
        <Text style={{ color: "#fff" }}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  map: {
    width: "100%",
    height: "10%",
  },

  taskers: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
    elevation: 10,
    padding: 20,
    height: "70%",
    paddingBottom: 70,
  },

  skipButton: {
    // make button fixed to bottom
    position: "absolute",
    bottom: 10,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    width: "30%",
    padding: 10,
    borderRadius: 10,
  },

  taskerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 30,
  },

  taskerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f3f5",
    paddingBottom: 10,
    // backgroundColor: "#000",
  },

  taskerDP: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#f2f3f5",
    marginRight: 10,
  },

  taskerDetails: {
    flex: 1,
  },

  taskerNameRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  taskerName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  taskerPriceAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  taskerRating: {
    flexDirection: "row",
    alignItems: "center",
  },

  taskerRatingText: {
    marginLeft: 5,
  },

  taskerPrice: {
    fontSize: 13,
    marginRight: 10,
  },

  timeAway: {
    flexDirection: "row",
    alignItems: "center",
  },

  timeAwayText: {
    marginLeft: 5,
    fontSize: 13,
  },

  taskerButton: {
    backgroundColor: "#02d5c9",
    padding: 5,
    borderRadius: 5,
  },

  taskerButtonText: {
    color: "#fff",
    // fontSize: 13,
  },
});
