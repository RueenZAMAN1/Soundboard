import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  FlatList,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
} from "react-native";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addSound } from "../../../../slices/SoundsSlice";
import { Audio } from "expo-av";
import * as FS from "expo-file-system";

//Component for searching a sound in the freesound API
export function SearchScreen() {
  const [sounds, setListSounds] = useState();
  const [soundInput, setSoundInput] = useState("");
  const [progress, setProgress] = useState({ downloadProgress: "" });
  const [error_msg, setErrorMsg] = useState("");
  const dispatch = useDispatch();

  const [playbackObject, setPlayBackObject] = useState();
  const [playing, setPlaying] = useState({
    isPlaying: false,
    idSound: undefined,
  });

  //Play the sound selected
  const playSound = async (selectedSound) => {
    const object = preparePlayback(selectedSound.previews["preview-hq-mp3"]);
    Promise.resolve(object).then((response) => {
      setPlayBackObject(response);
      setPlaying({ isPlaying: true, idSound: selectedSound.id });
    });
  };

  //Stop the playing sound
  const stopSound = async () => {
    await playbackObject.unloadAsync();
    setPlaying({ isPlaying: false, idSound: undefined });
  };

  //Load the sound selected
  const preparePlayback = async (selectedSound) => {
    const { sound: playbackObject } = await Audio.Sound.createAsync({
      uri: selectedSound,
    });
    playbackObject.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.didJustFinish) {
        setPlaying({ isPlaying: false, idSound: undefined });
      }
    });
    await playbackObject.playAsync();
    return playbackObject;
  };

  //Callback for dowloading process
  const callback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setProgress({ downloadProgress: progress });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBlock}>
        <TextInput
          placeholder="Search sound"
          placeholderTextColor="gray"
          value={soundInput}
          onChangeText={setSoundInput}
          style={{ color: "white" }}
        ></TextInput>
        <TouchableOpacity
          style={styles.button}
          onPress={() => findSound(soundInput)}
        >
          <Text>Search</Text>
        </TouchableOpacity>
      </View>
      <Text> {error_msg} </Text>
      <FlatList
        data={sounds}
        renderItem={({ item }) => (
          <View style={styles.line}>
            <Text value={item.name} style={{ color: "white" }}>
              {item.name}
            </Text>
            <View style={styles.actionDiv}>
              <TouchableOpacity onPress={() => handleSoundSelected(item)}>
                <View style={[styles.button]}>
                  <Text>Add</Text>
                </View>
              </TouchableOpacity>
              {playing.idSound != item.id && (
                <TouchableOpacity onPress={() => playSound(item)}>
                  <View style={[styles.button]}>
                    <Text>Play</Text>
                  </View>
                </TouchableOpacity>
              )}
              {playing.idSound == item.id && (
                <TouchableOpacity onPress={() => stopSound()}>
                  <View style={[styles.button]}>
                    <Text>Stop</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );

  //Download the sound selected
  async function handleSoundSelected(item) {
    const downloadResumable = FS.createDownloadResumable(
      item.previews["preview-hq-mp3"],
      FS.documentDirectory + item.id,
      {},
      callback
    );

    let sound = undefined;
    try {
      const { uri } = await downloadResumable.downloadAsync();
      sound = formatSound(item, uri);
    } catch (e) {
      console.error(e);
    }

    dispatch(addSound(sound));
    alert("Sound added in your library");
  }

  //Return a sound object with selected properties
  function formatSound(item, uri) {
    return {
      id: item.id,
      name: item.name,
      download: uri,
      type: "freesound",
    };
  }

  //Find a sound
  function findSound(input) {
    const sounds = findSoundsByInput(input);
    Promise.resolve(sounds)
      .then((response) => {
        setListSounds(response);
      })
      .catch((err) => {
        console.log("network Error");
        setErrorMsg("Network error: Please check your internet connection");
      });
  }

  //Api call to retrieve sounds
  async function findSoundsByInput(input) {
    try {
      const resp = await axios.get(
        "http://freesound.org/apiv2/search/text/?query=" +
          input +
          "&fields=id,name,previews,download&token=jY8inepynCSYGuKiXXmcWfVk53iW8ww9SUDRSJ5V"
      );
      return resp.data.results;
    } catch (err) {
      console.error(err);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#242423",
    height: "100%",
  },

  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
  },

  actionDiv: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  searchBlock: {
    flexDirection: "row",
    alignSelf: "center",
  },

  searchLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  button: {
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    height: 40,
    marginVertical: 10,
    marginHorizontal: 5,
  },
});
