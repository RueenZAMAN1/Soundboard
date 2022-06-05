import { createSlice } from "@reduxjs/toolkit";
import * as FS from "expo-file-system";

export const SoundsSlice = createSlice({
    name: "sounds",
    initialState: [
        {
            id: 0,
            name: "Cymbal",
            download: require("../../assets/defaultSounds/cymbal.wav"),
            type: "default"
        },
        {
            id: 1,
            name: "Daibyoshi",
            download: require("../../assets/defaultSounds/daibyoshi.wav"),
            type: "default"
        },
        {
            id: 2,
            name: "Med Taiko",
            download: require("../../assets/defaultSounds/med_taiko.wav"),
            type: "default"
        },
        {
            id: 3,
            name: "Miyadaiko",
            download: require("../../assets/defaultSounds/miyadaiko.wav"),
            type: "default"
        },
        {
            id: 4,
            name: "Tsuzumi",
            download: require("../../assets/defaultSounds/tsuzumi.wav"),
            type: "default"
        },
        {
            id: 5,
            name: "Taiko",
            download: require("../../assets/defaultSounds/taiko.wav"),
            type: "default"
        }
    ],

    reducers: {
        //Add a new sound the sound library
        addSound (state, action) {
            state.push(action.payload)
        },
        //Replace a sound by another with same id
        updateSound (state,action) {
            state.sounds = state.sounds.map((sound) => sound.id === action.payload.id ? sound = action.payload : true);
        },
        //Delete sound from app and device
        deleteSound (state, action) {
            FS.deleteAsync(state.filter((sound) => sound.id === action.payload.id)[0].download);
            return state.filter((sound) => sound.id !== action.payload.id);
        },
        //Delete all the sounds from app and device
        deleteAll (state, action) {
            state.map((sound) => sound.type != "default" ? FS.deleteAsync(sound.download) : undefined)
            return state.filter((sound) => sound.type == "default");
        }
    },
});
  
export const { addSound, updateSound, deleteSound, deleteAll } = SoundsSlice.actions;
export default SoundsSlice.reducer;
export const soundsSelector = (state) => state.sounds;
export const freeSoundsSelector = (state) => state.sounds.filter((sound) => sound.type === "freesound");
export const mySoundsSelector = (state) => state.sounds.filter((sound) => sound.type === "mysound");
export const defaultSelector = (state) => state.sounds.filter((sound) => sound.type === "default");

//Return an unique id for a sound
export const nextIdSelector = (state) => {
    let ids = state.sounds.map((sound) => sound.id);
    return Math.max.apply(Math, ids)+1;
}
