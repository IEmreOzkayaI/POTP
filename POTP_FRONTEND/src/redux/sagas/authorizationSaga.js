import {all, put, call, takeLatest} from "redux-saga/effects";
import axios from "axios";
import { authorizationProgress , authorizationSuccess , authorizationFailure } from "../toolkit/authorizationSlice";

export default function* authorizationSaga() {
	yield all([authorizationWatcher()]);
}
function* authorizationWatcher() {
	yield takeLatest("authorization/authorizationFetch", authorization);
}

function* authorization(action) {
	try {
		yield put(authorizationProgress());
		const authorizationResponse = yield call(authorizationWrapper, action.payload);
		yield put(authorizationSuccess(authorizationResponse));
	} catch (err) {
		console.log(err);
		yield put(authorizationFailure(err));
	}
}

function* authorizationWrapper(payload) {
	const {confirm_credential} = payload;
	const promise = yield new Promise((resolve, reject) => {
		axios
			.post(
				"http://localhost:3000/api/user/confirm",
				{confirm_credential},
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
			)
			.then((res) => {
				const data = res.data;
				resolve(data);
			})
			.catch((err) => {
				reject(err.response.data);
			});
	});
	return promise;
}
