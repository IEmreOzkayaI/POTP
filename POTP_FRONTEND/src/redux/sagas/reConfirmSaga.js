import {all, put, call, takeLatest} from "redux-saga/effects";
import axios from "axios";
import {reConfirmFailure, reConfirmProgress, reConfirmSuccess} from "../toolkit/reConfirmSlice";

export default function* reConfirmSaga() {
	yield all([reconfirmWatcher()]);
}

function* reconfirmWatcher() {
	yield takeLatest("reConfirm/reConfirmFetch", reconfirm);
}

function* reconfirm() {
	try {
		yield put(reConfirmProgress());
		const reconfirmResponse = yield call(reConfirmWrapper);
		yield put(reConfirmSuccess(reconfirmResponse));

	} catch (err) {
		yield put(reConfirmFailure(err));
	}
}

function* reConfirmWrapper() {
	const promise = yield new Promise((resolve, reject) => {
		axios
			.get("http://localhost:3000/api/user/re-confirm", {
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			})
			.then((res) => {
				const data = res.data;
				resolve(data);
			})
			.catch((err) => {
				console.log(err);
				reject(err.response.data);
			});
	});
	return promise;
}
