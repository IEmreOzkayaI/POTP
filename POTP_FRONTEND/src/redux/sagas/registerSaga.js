import {all, put, call, takeLatest} from "redux-saga/effects";
import axios from "axios";
import {registerProgress, registerSuccess, registerFailure} from "../toolkit/registerSlice";

export default function* registerSaga() {
	yield all([registerWatcher()]);
}
function* registerWatcher() {
	yield takeLatest("register/registerFetch", register);
}

function* register(action) {
	try {
		yield put(registerProgress());
		const registerResponse = yield call(registerWrapper, action.payload);
		yield put(registerSuccess(registerResponse));
	} catch (err) {
		yield put(registerFailure(err));
	}
}

function* registerWrapper(payload) {
	const {Individual_User, Company_User} = payload;
	const user = Individual_User ? Individual_User : Company_User;

	const promise = yield new Promise((resolve, reject) => {
		axios
			.post("http://localhost:3000/api/user/register", user, {
				withCredentials: true,
			})
			.then((res) => {
				const data = res.data;
				resolve(data);
			})
			.catch((err) => {
				if (err.response.data.message === "User Already Exists");
				reject(err);
			});
	});

	return promise;
}
