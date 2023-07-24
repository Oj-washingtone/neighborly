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
} from "firebase/firestore";

import * as Location from "expo-location";

export default function JobPostForm() {
  const user = useAuthentication();
  const userId = user?.uid;
  const navigation = useNavigation();

  const [jobDetails, setJobDetails] = useState({
    jobTitle: "",
    jobDescription: "",
    jobBudget: "negotiable",
    taskDetails: { date: "", time: "" },
  });

  const [waiting, setWaiting] = useState(false);

  const [taskCategories, setTaskCategories] = useState([]);
  const [taskRecommendations, setTaskRecommendations] = useState([]);

  // generate alphanumeric id for job post
  const generateId = () => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const taskId = generateId();

  // start date picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);

    // update task details in job details
    setJobDetails({
      ...jobDetails,
      taskDetails: {
        ...jobDetails.taskDetails,
        date: currentDate.toDateString(),
        time: currentDate.toLocaleTimeString(),
      },
    });
  };

  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  // date picker end

  // // get task categories
  useEffect(() => {
    const fetchTaskCategories = async () => {
      try {
        const docRef = doc(db, "taskcategories", "4tY8RvQ7VOVfsRFCJVt6");

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const taskCategoriesArray = data.taskcategories;
          setTaskCategories(taskCategoriesArray);
        }
      } catch (error) {
        console.log("Error fetching task categories:", error);
      }
    };
    fetchTaskCategories();
  }, []);

  const searchTaskRecommendations = (input) => {
    if (input.trim() === "") {
      // If the input is empty, clear the recommendations
      setTaskRecommendations([]);
      return;
    }

    const filteredTasks = taskCategories.filter((category) =>
      category.toLowerCase().includes(input.toLowerCase())
    );
    setTaskRecommendations(filteredTasks);
  };

  const selectTask = (task) => {
    setJobDetails({ ...jobDetails, jobTitle: task });
    setTaskRecommendations([]); // Clear the task recommendations
  };

  const handleSubmit = async () => {
    setWaiting(true);
    // get location of user
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
  
    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      const updatedJobDetails = {
        ...jobDetails,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        taskId: taskId,
      };
  
      // create new job post in firestore
      const jobPostRef = doc(db, "jobposts", taskId);
  
      const payload = {
        ...updatedJobDetails,
        userId: userId,
      };
  
      await setDoc(jobPostRef, payload);
  
      setJobDetails(updatedJobDetails);
      setWaiting(false);
  
      // navigate to Select Tasker screen, with job details
      navigation.navigate("Select Tasker", { jobDetails: updatedJobDetails });
    }
  };
  

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.formWrapper}>
          <Text>Task</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter task"
            placeholderTextColor="#aaaaaa"
            onChangeText={
              // set job titles in thejob details and searchTaskRecommendations
              (text) => {
                setJobDetails({ ...jobDetails, jobTitle: text });
                searchTaskRecommendations(text);
              }
            }
            value={jobDetails.jobTitle}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          {/* Display task recommendations */}
          {taskRecommendations.length > 0 && (
            <View style={styles.recommendations}>
              <Text
                style={{
                  color: "#aaaaaa",
                  fontSize: 12,
                  fontStyle: "italic",
                }}
              >
                Select below:
              </Text>
              {taskRecommendations.map((task, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recommendation}
                  onPress={() => selectTask(task)}
                >
                  <Text
                    style={{
                      color: "#aaaaaa",
                      fontSize: 12,
                    }}
                  >
                    {task}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text>Task description</Text>
          <TextInput
            style={[
              styles.textInput,
              { height: 100, textAlignVertical: "top" },
            ]}
            placeholder="Enter a description"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) =>
              setJobDetails({ ...jobDetails, jobDescription: text })
            }
            value={jobDetails.jobDescription}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={4}
          />
          <Text>Your budget (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter job budget KES."
            placeholderTextColor="#aaaaaa"
            onChangeText={
              // set job titles in thejob details and searchTaskRecommendations
              (text) => {
                setJobDetails({ ...jobDetails, jobBudget: text });
              }
            }
            value={jobDetails.jobBudget}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            keyboardType="numeric"
          />
          <Text>Location</Text>
          <Picker
          // selectedValue={rules.contributionFrequency}
          // onValueChange={(itemValue, itemIndex) =>
          //   setRules({ ...rules, contributionFrequency: itemValue })
          // }
          >
            <Picker.Item label="My current location" value="current location" />
            <Picker.Item
              label="Choose different location"
              value="diffrent location"
            />
          </Picker>

          <Text>Date and Time</Text>
          <View style={styles.dateTimeWrapper}>
            <View style={styles.dateTime}>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={false}
                  onChange={onChange}
                />
              )}
              <TouchableOpacity
                style={styles.pickerButtons}
                onPress={showDatepicker}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#ccc"
                />
                <Text style={styles.inputText}>Select date </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pickerButtons}
                onPress={showTimepicker}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#ccc"
                />
                <Text style={styles.inputText}>Select time</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateTimeInputWrapper}>
              {jobDetails.taskDetails.date !== "" && (
                <TextInput
                  style={[styles.input, styles.dateTimeInput]}
                  placeholder="Date"
                  keyboardType="numeric"
                  editable={false}
                  value={jobDetails.taskDetails.date}
                  disabled={true}
                />
              )}

              {jobDetails.taskDetails.time !== "" && (
                <TextInput
                  style={[styles.input, styles.dateTimeInput]}
                  placeholder="Time"
                  keyboardType="numeric"
                  editable={false}
                  value={jobDetails.taskDetails.time}
                  disabled={true}
                />
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={waiting}
            activeOpacity={waiting ? 1 : 0.2}
          >
            {waiting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonTitle}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  formWrapper: {
    width: "80%",
    marginTop: 30,
  },

  textInput: {
    width: "100%",
    borderColor: "#cccccc",
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#02d5c9",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
  },

  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  dateTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  pickerButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#cccccc",
    borderWidth: 1,
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
  },

  dateTimeInputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dateTimeInput: {
    color: "#000",
  },

  inputText: {
    marginLeft: 8,
  },

  recommendation: {
    padding: 5,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  recommendations: {
    marginTop: 10,
    marginBottom: 40,
  },
});
