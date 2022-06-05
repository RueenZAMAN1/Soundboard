import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Audio } from "expo-av";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setEditing, editSelector } from "../../../slices/EditSlice";
import { padSelector } from "../../../slices/PadSlice";
import Trimmer from "react-native-trimmer";

//Component to edit a sound or remplace it
export function EditScreen({ navigation, route }) {
  const editing = useSelector(editSelector);
  const pad = useSelector(padSelector);
  const [currSound, setCurrSound] = useState(route.params.btn.sound);
  const [duration, setDuration] = useState(1000);
  const [playbackObject, setPlayBackObject] = useState();
  const initialLeftHandlePosition = 0;

  const dispatch = useDispatch();

  const [trimmer, setTrimmer] = useState({
    playing: false,
    trimmerLeftHandlePosition: initialLeftHandlePosition,
    trimmerRightHandlePosition: 2000,
  });

  const [scrubberPosition, setScrubberPosition] = useState(1);

  //On mount, load the sound passed in the navigation parameter
  //On unmount, editing is close
  useEffect(() => {
    const object = preparePlayback();
    Promise.resolve(object).then((response) => {
      setPlayBackObject(response);
    });
    return () => dispatch(setEditing({ btn_id: -1, editing: false }));
  }, []);

  //Set duration of playback object
  useEffect(() => {
    if (playbackObject) {
      getDuration();
    }
  }, [playbackObject]);

  //Do some action when playback object status update
  const onPlaybackStatusUpdate = async (playbackObject) => {
    playbackObject.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.didJustFinish) {
        pauseScrubber();
      }
      if (!playbackStatus.isLoaded) {
        // Update your UI for the unloaded state
        if (playbackStatus.error) {
          console.log(
            `Encountered a fatal error during playback: ${playbackStatus.error}`
          );
        }
      }
    });
  };

  //Load the sound
  const preparePlayback = async () => {
    if (currSound.type == "default") {
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        currSound.download
      );
      onPlaybackStatusUpdate(playbackObject);
      return playbackObject;
    } else {
      const { sound: playbackObject } = await Audio.Sound.createAsync({
        uri: currSound.download,
      });
      onPlaybackStatusUpdate(playbackObject);
      return playbackObject;
    }
  };

  //Get the duration of the sound
  const getDuration = () => {
    playbackObject.getStatusAsync().then(function (result) {
      setDuration(result.durationMillis);
    });
  };

  //Play the sound loaded
  const play = () => {
    const stop = stopSound();
    Promise.resolve(stop).then((resp) => {
      setScrubberPosition(1);
      const action = playSound();
      Promise.resolve(action).then((resp) => {
        playScrubber();
      });
    });
  };

  //Stop the sound playing
  const stop = () => {
    const stop = stopSound();
    Promise.resolve(stop).then((resp) => {
      pauseScrubber();
    });
  };

  const playSound = async () => {
    await playbackObject.playAsync();
  };

  const stopSound = async () => {
    await playbackObject.stopAsync();
  };

  //Play scrubber at the same time of the sound
  const playScrubber = () => {
    setTrimmer((prevState) => ({
      ...prevState,
      playing: true,
    }));
    this.interval = setInterval(() => {
      setScrubberPosition((scrubberPosition) => scrubberPosition + 100);
    }, 100);
  };

  //Pause the scrubber
  const pauseScrubber = () => {
    clearInterval(this.interval);
    setTrimmer((prevState) => ({
      ...prevState,
      playing: false,
    }));
    setScrubberPosition((scrubberPosition) => scrubberPosition + 90);
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionDiv}>
        {trimmer.playing ? (
          <TouchableOpacity onPress={() => stop()} style={styles.button}>
            <View>
              <Text>Pause</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => play()} style={styles.button}>
            <View>
              <Text>Play</Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleChangeSound()}
        >
          <Text>Change sound</Text>
        </TouchableOpacity>
      </View>
      <Trimmer
        totalDuration={duration}
        trimmerLeftHandlePosition={trimmer.trimmerLeftHandlePosition}
        trimmerRightHandlePosition={trimmer.trimmerRightHandlePosition}
        minimumTrimDuration={1000}
        maxTrimDuration={duration}
        maximumZoomLevel={0}
        zoomMultiplier={0}
        initialZoomValue={0}
        scaleInOnInit={true}
        tintColor="#f638dc"
        markerColor="#5a3d5c"
        trackBackgroundColor="#382039"
        trackBorderColor="#5a3d5c"
        scrubberColor="#b7e778"
        scrubberPosition={scrubberPosition}
      />
    </View>
  );

  //Change the sound of the current pad
  function handleChangeSound() {
    navigation.navigate("Library");
  }
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
    marginHorizontal: 5,
  },
  actionDiv: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
