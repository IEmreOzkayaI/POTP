import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
    userError: false,
    userProgress: false,
    userInit: null,
};

const reducers = {
    userProgress: (state) => {
        state.userInfo = null;
        state.userError = false;
        state.userProgress = true;
        state.userInit = false;
    },
    userSuccess: (state, action) => {
        state.userInfo = action.payload;
        state.userError = false;
        state.userInit = false;
        state.userProgress = false;
    },
    userFailure: (state, action) => {
        state.userError = action.payload;
        state.userInfo = null;
        state.userProgress = false;
        state.userInit = false;
    },
    clearUserInfo: (state) => {
        state.userInfo = null;
        state.userError = false;
        state.userInit = false;
        state.userProgress = false;
    },
    userFetch: (state, action) => {
        state.userInit = action.payload;
        state.userInfo = null;
        state.userError = false;
        state.userProgress = false;
    },
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers,
});

export const {userProgress, userFailure, userSuccess, clearUserInfo, userFetch} = userSlice.actions;
export default userSlice.reducer;