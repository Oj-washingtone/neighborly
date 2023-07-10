import React, { useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import * as Location from "expo-location";
import {
  collection,
  where,
  query,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useAuthentication } from "../../utils/hooks/useAuthentication";

const JobItemSkeleton = () => {
  const user = useAuthentication();
  const userId = user?.uid;
  const [waiting, setWaiting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const handleAllowLocation = async () => {
    try {
      setWaiting(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setUserLocation(location);

        try {
          const docRef = doc(db, "users", userId);
          await setDoc(
            docRef,
            {
              location: userLocation,
            },
            { merge: true }
          );

          alert("Location updated successfully");
          setWaiting(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Permission Denied", "Location access was not granted.");
        setWaiting(false);
      }
    } catch (error) {
      console.error("Error requesting location access:", error);
      setWaiting(false);
    } finally {
      setWaiting(false);
    }
  };

  //call the function

  //   set timeout of 20 seconds before calling the function
  setTimeout(() => {
    handleAllowLocation();
  }, 30000);

  return (
    <View style={styles.skeleton}>
      <View style={styles.jobItemWrapper}>
        <View style={styles.jobItem}>
          <View style={styles.jobDp}>
            <ActivityIndicator size="small" color="#ccc" />
          </View>
          <View style={styles.jobParticulars}>
            <View style={styles.nameSkeleton} />
            <View style={styles.detailsWrapper}>
              <View style={styles.locationSkeleton} />
            </View>
            <View style={styles.detailsWrapper}>
              <View style={styles.timeSkeleton} />
            </View>
            <View style={styles.JobAction}>
              <View style={styles.moreBtnSkeleton} />
            </View>
          </View>
          <View style={styles.budget}>
            <View style={styles.currencySkeleton} />
            <View style={styles.amountSkeleton} />
          </View>
        </View>
      </View>
      <View style={styles.jobItemWrapper}>
        <View style={styles.jobItem}>
          <View style={styles.jobDp}>
            <ActivityIndicator size="small" color="#ccc" />
          </View>
          <View style={styles.jobParticulars}>
            <View style={styles.nameSkeleton} />
            <View style={styles.detailsWrapper}>
              <View style={styles.locationSkeleton} />
            </View>
            <View style={styles.detailsWrapper}>
              <View style={styles.timeSkeleton} />
            </View>
            <View style={styles.JobAction}>
              <View style={styles.moreBtnSkeleton} />
            </View>
          </View>
          <View style={styles.budget}>
            <View style={styles.currencySkeleton} />
            <View style={styles.amountSkeleton} />
          </View>
        </View>
      </View>
      <View style={styles.jobItemWrapper}>
        <View style={styles.jobItem}>
          <View style={styles.jobDp}>
            <ActivityIndicator size="small" color="#ccc" />
          </View>
          <View style={styles.jobParticulars}>
            <View style={styles.nameSkeleton} />
            <View style={styles.detailsWrapper}>
              <View style={styles.locationSkeleton} />
            </View>
            <View style={styles.detailsWrapper}>
              <View style={styles.timeSkeleton} />
            </View>
            <View style={styles.JobAction}>
              <View style={styles.moreBtnSkeleton} />
            </View>
          </View>
          <View style={styles.budget}>
            <View style={styles.currencySkeleton} />
            <View style={styles.amountSkeleton} />
          </View>
        </View>
      </View>
      <View style={styles.jobItemWrapper}>
        <View style={styles.jobItem}>
          <View style={styles.jobDp}>
            <ActivityIndicator size="small" color="#ccc" />
          </View>
          <View style={styles.jobParticulars}>
            <View style={styles.nameSkeleton} />
            <View style={styles.detailsWrapper}>
              <View style={styles.locationSkeleton} />
            </View>
            <View style={styles.detailsWrapper}>
              <View style={styles.timeSkeleton} />
            </View>
            <View style={styles.JobAction}>
              <View style={styles.moreBtnSkeleton} />
            </View>
          </View>
          <View style={styles.budget}>
            <View style={styles.currencySkeleton} />
            <View style={styles.amountSkeleton} />
          </View>
        </View>
      </View>
      <View style={styles.jobItemWrapper}>
        <View style={styles.jobItem}>
          <View style={styles.jobDp}>
            <ActivityIndicator size="small" color="#ccc" />
          </View>
          <View style={styles.jobParticulars}>
            <View style={styles.nameSkeleton} />
            <View style={styles.detailsWrapper}>
              <View style={styles.locationSkeleton} />
            </View>
            <View style={styles.detailsWrapper}>
              <View style={styles.timeSkeleton} />
            </View>
            <View style={styles.JobAction}>
              <View style={styles.moreBtnSkeleton} />
            </View>
          </View>
          <View style={styles.budget}>
            <View style={styles.currencySkeleton} />
            <View style={styles.amountSkeleton} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  nameSkeleton: {
    width: "80%",
    height: 12,
    backgroundColor: "#f2f3f5",
    marginBottom: 5,
    borderRadius: 5,
  },
  detailsWrapper: {
    flexDirection: "row",
    marginTop: 5,
  },
  locationSkeleton: {
    width: 70,
    height: 12,
    backgroundColor: "#f2f3f5",
    borderRadius: 5,
  },
  timeSkeleton: {
    width: 50,
    height: 12,
    backgroundColor: "#f2f3f5",
    borderRadius: 5,
  },
  JobAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 15,
  },
  moreBtnSkeleton: {
    width: 80,
    height: 12,
    backgroundColor: "#f2f3f5",
    borderRadius: 5,
  },
  budget: {
    alignItems: "center",
  },
  currencySkeleton: {
    width: 30,
    height: 15,
    backgroundColor: "#f2f3f5",
    marginBottom: 5,
    borderRadius: 5,
  },
  amountSkeleton: {
    width: 60,
    height: 20,
    backgroundColor: "#f2f3f5",
    borderRadius: 5,
  },
});

export default JobItemSkeleton;
