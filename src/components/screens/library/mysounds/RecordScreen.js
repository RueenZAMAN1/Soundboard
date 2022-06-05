import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { Audio } from "expo-av";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addSound } from "../../../../slices/SoundsSlice";
import { useSelector } from "react-redux";
import { nextIdSelector } from "../../../../slices/SoundsSlice";

//Component for recording sounds
export function RecordScreen() {
  const [recording, setRecording] = useState();
  const [showModal, setShowModal] = useState(false);
  const [nameInput, setNameInput] = useState();
  const nextId = useSelector(nextIdSelector);
  const dispatch = useDispatch();

  //Start recording
  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  //Stop recording
  async function stopRecording() {
    await recording.stopAndUnloadAsync();
    setShowModal(true);
  }

  //Save the sound previously recorded
  function save() {
    if (nameInput && recording) {
      const uri = recording.getURI();
      const formatedSound = formatSound(uri, nameInput);
      setNameInput(undefined);
      setRecording(undefined);
      dispatch(addSound(formatedSound));
      setShowModal(false);
    }
  }

  //Cancel the previous sound recorded
  function cancel() {
    setNameInput(undefined);
    setRecording(undefined);
    setShowModal(false);
  }

  //Returns an object with specific properties
  function formatSound(soundURI, name) {
    return {
      id: nextId,
      name: name,
      download: soundURI,
      type: "mysound",
    };
  }

  return (
    <View style={styles.container}>
      {showModal == false && (
        <TouchableOpacity
          onPress={recording ? stopRecording : startRecording}
          style={styles.button}
        >
          <View>
            <Text>{recording ? "Stop Recording" : "Start Recording"}</Text>
          </View>
        </TouchableOpacity>
      )}

      {showModal == true && (
        <View>
          <TextInput
            value={nameInput}
            placeholder="Recording name"
            onChangeText={setNameInput}
            placeholderTextColor="grey"
            style={styles.text}
          ></TextInput>
          <TouchableOpacity onPress={() => save()}>
            <View style={styles.button}>
              <Text>OK</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => cancel()}>
            <View style={styles.button}>
              <Text>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242423",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    height: 40,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  text: {
    color: "white",
  },
});
