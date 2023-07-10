import React, { useState, useRef } from "react";
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

export default function JobPostForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobBudget, setJobBudget] = useState("");

  const [taskDetails, setTaskDetails] = useState({
    date: "",
    time: "",
  });

  // start date picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);

    setTaskDetails({
      ...taskDetails,
      date: selectedDate.toDateString(),
      time: selectedDate.toLocaleTimeString(),
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

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text>Job post form</Text>
        <View style={styles.formWrapper}>
          <Text>Task</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter task"
            placeholderTextColor="#aaaaaa"
            //   onChangeText={(text) => setJobTitle(text)}
            value={jobTitle}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <Text>Task description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter job description"
            placeholderTextColor="#aaaaaa"
            //   onChangeText={(text) => setJobDescription(text)}
            value={jobDescription}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <Text>Your budget (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter job budget KES."
            placeholderTextColor="#aaaaaa"
            //   onChangeText={(text) => setJobBudget(text)}
            value={jobBudget}
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
                  color="#bd0832"
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
                  color="#bd0832"
                />
                <Text style={styles.inputText}>Select time</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateTimeInputWrapper}>
              {taskDetails.date !== "" && (
                <TextInput
                  style={[styles.input, styles.dateTimeInput]}
                  placeholder="Date"
                  keyboardType="numeric"
                  editable={false}
                  value={taskDetails.date}
                  disabled={true}
                />
              )}

              {taskDetails.time !== "" && (
                <TextInput
                  style={[styles.input, styles.dateTimeInput]}
                  placeholder="Time"
                  keyboardType="numeric"
                  editable={false}
                  value={taskDetails.time}
                  disabled={true}
                />
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonTitle}>Post</Text>
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
    height: 50,
    width: "100%",
    borderColor: "#cccccc",
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#02d5c9",
    borderRadius: 10,
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
  },

  dateTimeInputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dateTimeInput: {
    color: "#000",
  },
});
