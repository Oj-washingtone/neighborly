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
} from "firebase/firestore";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { UserContext } from "../navigation/index";
import { useNavigation } from "@react-navigation/native";

export default function Preferences() {
  const user = useAuthentication();
  const userId = user?.uid;
  const navigation = useNavigation();

  const [taskCategories, setTaskCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      getUserDetails();
    }
  }, [userId]);

  // alert(JSON.stringify(userDetails));

  useEffect(() => {
    const fetchTaskCategories = async () => {
      try {
        const docRef = doc(db, "taskcategories", "4tY8RvQ7VOVfsRFCJVt6");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const taskCategoriesArray = data.taskcategories;
          setTaskCategories(taskCategoriesArray);
          ``;
        }
      } catch (error) {
        console.log("Error fetching task categories:", error);
      }
    };

    fetchTaskCategories();
  }, []);

  const handleCategorySelection = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((selectedCategory) => selectedCategory !== category)
      );
    } else {
      setSelectedCategories((prevSelected) => [...prevSelected, category]);
    }
  };

  console.log("selectedCategories:", selectedCategories);

  //   Save preferences to firestore
  const savePreferences = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const existingUserSkills = userDoc.data().userSkills || [];
        const newUserSkills = [...existingUserSkills, ...selectedCategories];

        await setDoc(
          userRef,
          {
            userSkills: newUserSkills,
          },
          { merge: true }
        );
      }

      setLoading(false);
      navigation.navigate("Home Screen");
    } catch (error) {
      console.log("Error saving preferences:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          <View style={styles.logoWrapper}>
            <View style={styles.logo}>
              <MaterialCommunityIcons name="alpha-w" size={60} color="#000" />
              <Text style={styles.logoText}>workit</Text>
            </View>
            <Text style={styles.tagline}>
              Creating oppotunities, empowering people
            </Text>
          </View>
        </Text>
      </View>
      <View style={styles.preferences}>
        <Text style={styles.greetings}>Hello {userDetails.userName},</Text>
        <Text style={styles.intro}>
          We are glad to have you on board. Please select the categories of work
          you are interested in.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.workCategoryWrapper}>
            <View style={styles.categoriesContainer}>
              {taskCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryButton,
                    selectedCategories.includes(category) &&
                      styles.selectedCategoryButton,
                  ]}
                  onPress={() => handleCategorySelection(category)}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.botton}
          onPress={savePreferences}
          // disable button when loading
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.savePreferencesButtonText}>Continue</Text>
          )}
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
  },

  header: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  preferences: {
    flex: 5,
    width: "100%",
    marginTop: 20,
    // backgroundColor: "red",
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 30,
  },

  intro: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 30,
  },

  logo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#02d5c9",
  },

  tagline: {
    fontSize: 9,
    color: "#000",
    textAlign: "center",
    fontStyle: "italic",
  },

  logoWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginVertical: 50,
  },

  footer: {
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.8,
  },

  botton: {
    width: "100%",
    backgroundColor: "#02d5c9",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    elevation: 2,
  },

  savePreferencesButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
