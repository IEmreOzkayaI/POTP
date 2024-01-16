import {configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import logIn from "./toolkit/logInSlice";
import logInSaga from "./sagas/logInSaga";
import confirmSaga from "./sagas/confirmSaga";
import confirm from "./toolkit/confirmSlice";
import register from "./toolkit/registerSlice";
import registerSaga from "./sagas/registerSaga";
import user from "./toolkit/userSlice";
import userSaga from "./sagas/userSaga";
import authorization from "./toolkit/authorizationSlice";
import authorizationSaga from "./sagas/authorizationSaga";
import reConfirm from "./toolkit/reConfirmSlice";
import reConfirmSaga from "./sagas/reConfirmSaga";


const saga = createSagaMiddleware();
const store = configureStore({
	reducer: {logIn, confirm, register, user, authorization, reConfirm},
	middleware: [saga],
});
saga.run(logInSaga);
saga.run(confirmSaga);
saga.run(registerSaga);
saga.run(userSaga);
saga.run(authorizationSaga);
saga.run(reConfirmSaga);
export default store;
