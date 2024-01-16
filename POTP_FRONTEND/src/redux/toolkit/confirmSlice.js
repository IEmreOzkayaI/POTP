import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	confirmInfo: null,
	confirmError: false,
	confirmProgress: false,
	confirmInit: null,
};

const reducers = {
	confirmProgress: (state) => {
		state.confirmInfo = null;
		state.confirmError = false;
		state.confirmProgress = true;
		state.confirmInit = null;
	},
	confirmSuccess: (state, action) => {
		state.confirmInfo = action.payload;
		state.confirmError = false;
		state.confirmInit = null;
		state.confirmProgress = false;
	},
	confirmFailure: (state, action) => {
		state.confirmError = action.payload;
		state.confirmInfo = null;
		state.confirmProgress = false;
		state.confirmInit = null;
	},
	clearConfirmInfo: (state) => {
		state.confirmInfo = null;
		state.confirmError = false;
		state.confirmInit = null;
		state.confirmProgress = false;
	},
	confirmFetch: (state, action) => {
		state.confirmInit = action.payload;
		state.confirmInfo = null;
		state.confirmError = false;
		state.confirmProgress = false;
	},
};

const confirmSlice = createSlice({
	name: "confirm",
	initialState,
	reducers,
});

export const {confirmProgress, confirmFailure, confirmSuccess, clearConfirmInfo, confirmFetch} = confirmSlice.actions;
export default confirmSlice.reducer;
