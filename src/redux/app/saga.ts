import { takeLatest, put, call } from 'redux-saga/effects';

import { register } from '../../models/device';

import {
  INITIALIZE,
  INITIALIZED,
  LOADING_START,
  LOADING_STOP,
  GET_DEVICE_DETAILS,
  GET_DEVICE_DETAILS_SUCCESS,
  GET_DEVICE_DETAILS_FAILURE,
} from './actions';

function* initializeApp() {
  yield put({ type: LOADING_START }); // Start Loading

  yield put({ type: GET_DEVICE_DETAILS }); // Get Device Details

  yield put({ type: INITIALIZED }); // Initialized Application

  yield put({ type: LOADING_STOP }); // Stop Loading
}

function* deviceDetails() {
  try {
    yield call(register, { type: 'test' }); // Register Device

    yield put({ type: GET_DEVICE_DETAILS_SUCCESS }); // Get Device Details Success
  } catch (error) {
    yield put({ type: GET_DEVICE_DETAILS_FAILURE, error }); // Get Device Details Failure
  }
}

export default function* appSaga() {
  yield takeLatest(INITIALIZE, initializeApp);
  yield takeLatest(GET_DEVICE_DETAILS, deviceDetails);
}
