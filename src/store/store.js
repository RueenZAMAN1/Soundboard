import { configureStore, combineReducers } from "@reduxjs/toolkit";
import soundsSliceReducer from "../slices/SoundsSlice.js";
import padSliceReducer from "../slices/PadSlice";
import editSliceReducer from "../slices/EditSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import logger from 'redux-logger'
import thunk from 'redux-thunk'

const reducers = combineReducers({
    sounds: soundsSliceReducer,
    pad: padSliceReducer,
    edit: editSliceReducer
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['edit']
};

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk, logger]
})

export const persistor = persistStore(store);



