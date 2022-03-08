import { takeLatest, put } from "redux-saga/effects";

import {
  INITIALIZE,
  INITIALIZED,
  LOADING_START,
  LOADING_STOP,
} from "./actions";

function* initializeApp() {
  yield put({ type: LOADING_START }); // Start Loading

  yield put({ type: INITIALIZED }); // Initialized Application

  yield put({ type: LOADING_STOP }); // Stop Loading
}

export default function* appSaga() {
  yield takeLatest(INITIALIZE, initializeApp);
}
