import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	authorizationInfo: null,
	authorizationError: false,
	authorizationProgress: false,
	authorizationInit: null,
};

const reducers = {
	authorizationProgress: (state) => {
		state.authorizationInfo = null;
		state.authorizationError = false;
		state.authorizationProgress = true;
		state.authorizationInit = null;
	},
	authorizationSuccess: (state, action) => {
		state.authorizationInfo = action.payload;
		state.authorizationError = false;
		state.authorizationInit = null;
		state.authorizationProgress = false;
	},
	authorizationFailure: (state, action) => {
		state.authorizationError = action.payload;
		state.authorizationInfo = null;
		state.authorizationProgress = false;
		state.authorizationInit = null;
	},
	clearAuthorizationInfo: (state) => {
		state.authorizationInfo = null;
		state.authorizationError = false;
		state.authorizationInit = null;
		state.authorizationProgress = false;
	},
	authorizationFetch: (state, action) => {
		state.authorizationInit = action.payload;
		state.authorizationInfo = null;
		state.authorizationError = false;
		state.authorizationProgress = false;
	},
};

const authorizationSlice = createSlice({
	name: "authorization",
	initialState,
	reducers,
});

export const {authorizationProgress, authorizationFailure, authorizationSuccess, clearAuthorizationInfo, authorizationFetch} = authorizationSlice.actions;
export default authorizationSlice.reducer;
