import { takeLatest, put, call } from 'redux-saga/effects';

import { registerDevice, getDeviceDetails } from '../../models/app';

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
  yield put({ type: LOADING_START }); // Start Loading

  try {
    yield call(registerDevice, { type: 'test' }); // Register Device

    yield put({ type: GET_DEVICE_DETAILS_SUCCESS }); // Get Device Details Success
  } catch (error) {
    yield put({ type: GET_DEVICE_DETAILS_FAILURE, error }); // Get Device Details Failure
  }

  yield put({ type: LOADING_STOP }); // Stop Loading
}

export default function* appSaga() {
  yield takeLatest(INITIALIZE, initializeApp);
  yield takeLatest(INITIALIZE, deviceDetails);
}
