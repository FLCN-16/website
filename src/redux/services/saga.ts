import { takeLatest, put, call } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import { CONTACT_SUBMIT, CONTACT_SUCCESS, CONTACT_FAILURE } from './actions';

import { contact } from '../../models/services';

function* contactFormHandle({ payload }: AnyAction) {
  try {
    yield call(contact, payload);

    yield put({ type: CONTACT_SUCCESS });
  } catch (error) {
    yield put({ type: CONTACT_FAILURE, error });
  }
}

export default function* serviceSaga() {
  yield takeLatest(CONTACT_SUBMIT, contactFormHandle);
}
