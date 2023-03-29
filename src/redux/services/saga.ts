import { takeLatest, put, call, delay } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import {
  CONTACT_SUBMIT,
  CONTACT_SUCCESS,
  CONTACT_FAILURE,
  CONTACT_RESET,
  HIRE_SUBMIT,
  HIRE_SUCCESS,
  HIRE_FAILURE,
  HIRE_RESET,
} from './actions';

import { contact, projectRequirements } from '../../models/services';

function* contactFormHandle({ payload }: AnyAction) {
  try {
    yield call(contact, payload);

    yield put({ type: CONTACT_SUCCESS });
  } catch (error) {
    yield put({ type: CONTACT_FAILURE, error });
  }

  yield delay(2500);
  yield put({ type: CONTACT_RESET });
}

function* hireFormHandle({ payload }: AnyAction) {
  try {
    yield call(projectRequirements, payload);

    yield put({ type: HIRE_SUCCESS });
  } catch (error) {
    yield put({ type: HIRE_FAILURE, error });
  }

  yield delay(2500);
  yield put({ type: HIRE_RESET });
}

export default function* serviceSaga() {
  yield takeLatest(CONTACT_SUBMIT, contactFormHandle);
  yield takeLatest(HIRE_SUBMIT, hireFormHandle);
}
