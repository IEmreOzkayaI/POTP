import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	registerInfo: null,
	registerError: false,
	registerProgress: false,
	registerInit: null,
};

const reducers = {
	registerProgress: (state) => {
		state.registerInfo = null;
		state.registerError = false;
		state.registerProgress = true;
		state.registerInit = false;
	},
	registerSuccess: (state, action) => {
		state.registerInfo = action.payload;
		state.registerError = false;
		state.registerInit = false;
		state.registerProgress = false;
	},
	registerFailure: (state, action) => {
		state.registerError = action.payload;
		state.registerInfo = null;
		state.registerProgress = false;
		state.registerInit = false;
	},
	clearRegisterInfo: (state) => {
		state.registerInfo = null;
		state.registerError = false;
		state.registerInit = false;
		state.registerProgress = false;
	},
	registerFetch: (state, action) => {
		state.registerInit = action.payload;
		state.registerInfo = null;
		state.registerError = false;
		state.registerProgress = false;
	},
};

const registerSlice = createSlice({
	name: "register",
	initialState,
	reducers,
});

export const {registerProgress, registerFailure, registerSuccess, clearRegisterInfo, registerFetch} = registerSlice.actions;
export default registerSlice.reducer;
