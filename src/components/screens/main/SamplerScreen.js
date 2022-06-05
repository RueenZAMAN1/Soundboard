import React from 'react';
import { StyleSheet,  View, TouchableOpacity } from 'react-native';
import { useSelector } from "react-redux";
import { padSelector } from "../../../slices/PadSlice";
import { setEditing } from "../../../slices/EditSlice";
import { editSelector } from "../../../slices/EditSlice";
import { useDispatch } from "react-redux";
import { Audio } from "expo-av";

//Component displaying pads for playing
export function SamplerScreen({navigation}) {

    const pad = useSelector(padSelector);
    const dispatch = useDispatch();
    const editing = useSelector(editSelector);

    const playSound = async(selectedSound) => {
      if (selectedSound.type == "default"){
        const { sound } = await Audio.Sound.createAsync(selectedSound.download);
        await sound.playAsync();
      }
      else {
        const { sound } = await Audio.Sound.createAsync(
          {uri: selectedSound.download},
          {shouldPlay: true}
        );
        await sound.playAsync();
      }
    };

    const handlePlay = (btn_id) => {
        let soundBtn = pad.filter((btn) => btn.btn_id === btn_id)[0].sound
        playSound(soundBtn);
    }

    const editSound = (btn_id) =>{
        dispatch(setEditing({btn_id: btn_id, editing: true}));
        navigation.navigate("Edit", {btn: pad.filter((btn) => btn.btn_id === btn_id)[0]});
    }

    return (
      <View style={styles.container}>
        <View style={styles.line}>
          <TouchableOpacity style={[styles.square]} onPress={() => handlePlay(0)} onLongPress={() => editSound(0)}><View style={[styles.squareInside, {backgroundColor: "#BCEE00",}]}></View></TouchableOpacity>
          <TouchableOpacity style={[styles.square]} onPress={() => handlePlay(1)} onLongPress={() => editSound(1)}><View style={[styles.squareInside, {backgroundColor: "red",}]}></View></TouchableOpacity>
          <TouchableOpacity style={[styles.square]} onPress={() => handlePlay(2)} onLongPress={() => editSound(2)}><View style={[styles.squareInside, {backgroundColor: "#FF02B6",}]}></View></TouchableOpacity>
        </View>
        <View style={styles.line}>
          <TouchableOpacity style={[styles.square]} onPress={() => handlePlay(3)} onLongPress={() => editSound(3)}><View style={[styles.squareInside, {backgroundColor: "#C300EA",}]}></View></TouchableOpacity>
          <TouchableOpacity style={[styles.square]} onPress={() => handlePlay(4)} onLongPress={() => editSound(4)}><View style={[styles.squareInside, {backgroundColor: "#5D00E4",}]}></View></TouchableOpacity>
          <TouchableOpacity style={[styles.square]} onPress={() => handlePlay(5)} onLongPress={() => editSound(5)}><View style={[styles.squareInside, {backgroundColor: "#0144F7",}]}></View></TouchableOpacity>
        </View>
        <View style={styles.line}>
          <TouchableOpacity style={[styles.square]} onPress={() => handlePlay(6)} onLongPress={() => editSound(6)}><View style={[styles.squareInside, {backgroundColor: "#01CAF7",}]}></View></TouchableOpacity>
          <TouchableOpacity style={[styles.square]} onPress={() => handlePlay(7)} onLongPress={() => editSound(7)}><View style={[styles.squareInside, {backgroundColor: "#00E5AD",}]}></View></TouchableOpacity>
          <TouchableOpacity style={[styles.square]} onPress={() => handlePlay(8)} onLongPress={() => editSound(8)}><View style={[styles.squareInside, {backgroundColor: "#07DA00",}]}></View></TouchableOpacity>
        </View>
   </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242423',
    alignItems: 'center',
    justifyContent: 'center',
  },

  square: {
    backgroundColor: 'grey',
    width: 100,
    height: 100,
    margin: 7,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },

  squareInside: {
    width: '92%',
    height: '92%',
    alignSelf: 'center',
    borderRadius: 10,
  },

  line: {
    flexDirection: "row"
  }
});
