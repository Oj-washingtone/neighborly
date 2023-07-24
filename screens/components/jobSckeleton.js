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

export default function JobItemSkeleton() {
  const user = useAuthentication();
  const userId = user?.uid;
  const [waiting, setWaiting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

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
}

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
