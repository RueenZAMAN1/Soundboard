import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { defaultSelector } from "../../../slices/SoundsSlice";
import { editSelector, setEditing } from "../../../slices/EditSlice";
import { useDispatch } from "react-redux";
import { updateSound } from "../../../slices/PadSlice";
import { useState } from "react";
import { Audio } from "expo-av";

//Component displaying all default sounds
export function DefaultsoundsTab({ navigation }) {
  const defaultSounds = useSelector(defaultSelector);
  const editing = useSelector(editSelector);
  const [playbackObject, setPlayBackObject] = useState();
  const [playing, setPlaying] = useState({
    isPlaying: false,
    idSound: undefined,
  });
  const dispatch = useDispatch();

  //Play the sound selected
  const playSound = async (selectedSound) => {
    const object = preparePlayback(selectedSound.download);
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

  //Load the audio file
  const preparePlayback = async (selectedSound) => {
    const { sound: playbackObject } = await Audio.Sound.createAsync(
      selectedSound
    );
    playbackObject.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.didJustFinish) {
        setPlaying({ isPlaying: false, idSound: undefined });
      }
    });
    await playbackObject.playAsync();
    return playbackObject;
  };

  //Choose the sound for editing
  const chooseSound = (selectedSound) => {
    const index = editing.btn_id;
    dispatch(updateSound({ index: index, sound: selectedSound }));
    navigation.navigate("Edit", {
      btn: { btn_id: index, sound: selectedSound },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={defaultSounds}
        renderItem={({ item }) => (
          <View style={styles.line}>
            <Text value={item.name} style={styles.text}>
              {" "}
              {item.name}{" "}
            </Text>
            <View style={styles.actionDiv}>
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
              {editing.editing == true && (
                <TouchableOpacity onPress={() => chooseSound(item)}>
                  <View style={[styles.button]}>
                    <Text>Choose</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242423",
    padding: 10,
  },

  text: {
    color: "white",
  },

  line: {
    backgroundColor: "#242423",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  actionDiv: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
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

  searchBtn: {
    backgroundColor: "lightgrey",
    justifyContent: "center",
    padding: 10,
    height: 40,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  delete_btn: {
    backgroundColor: "red",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
  },

  delete_label: {
    color: "white",
  },

  rowBack: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 0,
  },
});
