import { createSlice } from "@reduxjs/toolkit";

/* 
* the editSlice enables to see if the app is editing a sound 
* so the library can display the button "choose" in lines sound
*/
export const EditSlice = createSlice({
    name: "edit",

    /*
    * btn_id: -1 -> no button in edition
    * editing: false -> no editing
    */
    initialState: {
        btn_id: -1,
        editing: false
    },
    reducers: {
        //Set editing state with new btn_id
        setEditing: (state, action) => {
            return state = {btn_id: action.payload.btn_id, editing: action.payload.editing};
        }
    },
});
  
export const { setEditing } = EditSlice.actions;
export default EditSlice.reducer;

//Return editing state
export const editSelector = (state) =>  {
    return state.edit;
}