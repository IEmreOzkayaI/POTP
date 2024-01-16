import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	logInInfo: null,
	logInError: false,
	logInProgress: false,
	logInInit: null,
};

const reducers = {
	logInProgress: (state) => {
		state.logInInfo = null;
		state.logInError = false;
		state.logInProgress = true;
		state.logInInit = null;
	},
	logInSuccess: (state, action) => {
		state.logInInfo = action.payload;
		state.logInError = false;
		state.logInInit = null;
		state.logInProgress = false;
	},
	logInFailure: (state, action) => {
		state.logInError = action.payload;
		state.logInInfo = null;
		state.logInProgress = false;
		state.logInInit = null;
	},
	clearLogInInfo: (state) => {
		state.logInInfo = null;
		state.logInError = false;
		state.logInInit = null;
		state.logInProgress = false;
	},
	logInFetch: (state, action) => {
		state.logInInit = action.payload;
		state.logInInfo = null;
		state.logInError = false;
		state.logInProgress = false;
	},
};

const logInSlice = createSlice({
	name: "logIn",
	initialState,
	reducers,
});

export const {logInProgress, logInFailure, logInSuccess, clearLogInInfo, logInFetch} = logInSlice.actions;
export default logInSlice.reducer;
