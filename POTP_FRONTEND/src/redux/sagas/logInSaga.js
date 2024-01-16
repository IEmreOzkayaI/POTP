import {all, put, call, takeLatest} from "redux-saga/effects";
import axios from "axios";
import {logInProgress, logInSuccess, logInFailure} from "../toolkit/logInSlice";

export default function* logInSaga() {
	yield all([logInWatcher()]);
}
function* logInWatcher() {
	yield takeLatest("logIn/logInFetch", logIn);
}

function* logIn(action) {
	try {
		yield put(logInProgress());
		const logInResponse = yield call(logInWrapper, action.payload);
		yield put(logInSuccess(logInResponse));
	} catch (err) {
		yield put(logInFailure(err));
	}
}

function* logInWrapper(payload) {
	const {logInForm} = payload;
	const promise = yield new Promise((resolve, reject) => {
		axios
			.post("http://localhost:3000/api/user/log-in", logInForm, {
				withCredentials: true,
			})
			.then((res) => {
				if (res.status === 200) {
					const data = res.data;
					resolve(data);
				}
			})
			.catch((err) => {
				reject(err.response.data);
			});
	});
	return promise;
}
