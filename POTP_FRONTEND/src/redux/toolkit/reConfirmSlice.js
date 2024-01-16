import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    reConfirmInfo: null,
    reConfirmError: false,
    reConfirmProgress: false,
    reConfirmInit: null,
};

const reducers = {
    reConfirmProgress: (state) => {
        state.reConfirmInfo = null;
        state.reConfirmError = false;
        state.reConfirmProgress = true;
        state.reConfirmInit = null;
    },
    reConfirmSuccess: (state, action) => {
        state.reConfirmInfo = action.payload;
        state.reConfirmError = false;
        state.reConfirmInfo = null;
        state.reConfirmProgress = false;
    },
    reConfirmFailure: (state, action) => {
        state.reConfirmError = action.payload;
        state.reConfirmInfo = null;
        state.reConfirmProgress = false;
        state.reConfirmInit = null;
    },
    clearReConfirmInfo: (state) => {
        state.reConfirmInfo = null;
        state.reConfirmError = false;
        state.reConfirmInit = null;
        state.reConfirmProgress = false;
    },
    reConfirmFetch: (state, action) => {
        state.reConfirmInit = action.payload;
        state.reConfirmInfo = null;
        state.reConfirmError = false;
        state.reConfirmProgress = false;
    },
};

const reConfirmSlice = createSlice({
    name: "reConfirm",
    initialState,
    reducers,
});

export const {
    reConfirmFailure,
    reConfirmProgress,
    reConfirmSuccess,
    clearReConfirmInfo,
    reConfirmFetch
} = reConfirmSlice.actions;
export default reConfirmSlice.reducer;
