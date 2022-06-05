import React from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSelector, useDispatch } from "react-redux";
import { mySoundsSelector } from "../../../../slices/SoundsSlice";
import { editSelector } from "../../../../slices/EditSlice";
import { useState } from "react";
import { updateSound } from "../../../../slices/PadSlice";
import { deleteSound } from "../../../../slices/SoundsSlice";
import { Audio } from "expo-av";
import * as FS from "expo-file-system";

export function ListScreen({ navigation }) {
  const mySounds = useSelector(mySoundsSelector);
  const editing = useSelector(editSelector);
  const [playbackObject, setPlayBackObject] = useState();
  const [playing, setPlaying] = useState({
    isPlaying: false,
    idSound: undefined,
  });
  const dispatch = useDispatch();

  //Play the sound selected
  const playSound = async (selectedSound) => {
    const file = await FS.getInfoAsync(selectedSound.download);
    const object = preparePlayback(file);
    Promise.resolve(object).then((response) => {
      setPlayBackObject(response);
      setPlaying({ isPlaying: true, idSound: selectedSound.id });
    });
  };

  //Load the audio file
  const preparePlayback = async (file) => {
    const { sound: playbackObject } = await Audio.Sound.createAsync(
      { uri: file.uri },
      { shouldPlay: true, volume: 1.0 }
    );

    playbackObject.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.didJustFinish) {
        setPlaying({ isPlaying: false, idSound: undefined });
      }
    });
    await playbackObject.playAsync();
    return playbackObject;
  };

  //Stop the playing sound
  const stopSound = async () => {
    await playbackObject.unloadAsync();
    setPlaying({ isPlaying: false, idSound: undefined });
  };

  //Choose the sound for editing
  const chooseSound = (selectedSound) => {
    const index = editing.btn_id;
    dispatch(updateSound({ index: index, sound: selectedSound }));
    navigation.navigate("Edit", {
      btn: { btn_id: index, sound: selectedSound },
    });
  };

  //Remove sound from app
  const removeSound = (selectedSound) => {
    dispatch(deleteSound({ id: selectedSound.id }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <SwipeListView
        data={mySounds}
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
              {editing.editing === true && (
                <TouchableOpacity onPress={() => chooseSound(item)}>
                  <View style={[styles.button]}>
                    <Text>Choose</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
            <TouchableOpacity onPress={() => removeSound(item)}>
              <View style={[styles.delete_btn]}>
                <Text style={[styles.delete_label]}> Delete </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Record")}>
        <View style={[styles.recordBtn]}>
          <Text>Record a sound</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242423",
    padding: 10,
  },

  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#242423",
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

  recordBtn: {
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
