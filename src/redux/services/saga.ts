import { takeLatest, put, call } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import {
  CONTACT_SUBMIT,
  CONTACT_SUCCESS,
  CONTACT_FAILURE,
  HIRE_SUBMIT,
  HIRE_SUCCESS,
  HIRE_FAILURE,
} from './actions';

import { contact, projectRequirements } from '../../models/services';

function* contactFormHandle({ payload }: AnyAction) {
  try {
    yield call(contact, payload);

    yield put({ type: CONTACT_SUCCESS });
  } catch (error) {
    yield put({ type: CONTACT_FAILURE, error });
  }
}

function* hireFormHandle({ payload }: AnyAction) {
  try {
    yield call(projectRequirements, payload);

    yield put({ type: HIRE_SUCCESS });
  } catch (error) {
    yield put({ type: HIRE_FAILURE, error });
  }
}

export default function* serviceSaga() {
  yield takeLatest(CONTACT_SUBMIT, contactFormHandle);
  yield takeLatest(HIRE_SUBMIT, hireFormHandle);
}
