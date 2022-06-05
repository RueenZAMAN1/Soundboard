import { createSlice } from "@reduxjs/toolkit";

//PadSlice contains the state of the user sampler
export const PadSlice = createSlice({
    name: "pad",
    initialState:  [
        {
            btn_id: 0,
            sound: {
                id: 0,
                name: "Cymbal",
                download: require("../../assets/defaultSounds/cymbal.wav"),
                type: "default"
            }
        },
        {
            btn_id: 1,
            sound: {
                id: 1,
                name: "Daibyoshi",
                download: require("../../assets/defaultSounds/daibyoshi.wav"),
                type: "default"
            }
        },
        {
            btn_id: 2,
            sound: {
                id: 2,
                name: "Med Taiko",
                download: require("../../assets/defaultSounds/med_taiko.wav"),
                type: "default"
            }
        },
        {
            btn_id: 3,
            sound: {
                id: 3,
                name: "Miyadaiko",
                download: require("../../assets/defaultSounds/miyadaiko.wav"),
                type: "default"
            }
        },
        {
            btn_id: 4,
            sound: {
                id: 4,
                name: "Tsuzumi",
                download: require("../../assets/defaultSounds/tsuzumi.wav"),
                type: "default"
            }
        },
        {
            btn_id: 5,
            sound: {
                id: 5,
                name: "Taiko",
                download: require("../../assets/defaultSounds/taiko.wav"),
                type: "default"
            }
        },
        {
            btn_id: 6,
            sound: {
                id: 5,
                name: "Taiko",
                download: require("../../assets/defaultSounds/taiko.wav"),
                type: "default"
            }
        },
        {
            btn_id: 7,
            sound: {
                id: 5,
                name: "Taiko",
                download: require("../../assets/defaultSounds/taiko.wav"),
                type: "default"
            }
        },
        {
            btn_id: 8,
            sound: {
                id: 5,
                name: "Taiko",
                download: require("../../assets/defaultSounds/taiko.wav"),
                type: "default"
            }
        }
    ],

    reducers: {
        //Replace the sound of a pad by the sound passed in parameter
        updateSound (state,action) {
            state.filter((btn) => btn.btn_id == action.payload.index)[0].sound = action.payload.sound
        }
    },
});
  
export const { updateSound } = PadSlice.actions;
export default PadSlice.reducer;

//Return pads state
export const padSelector = (state) => state.pad;