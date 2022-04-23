import { takeLatest, put } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import { WALLET_CONNECT_CONNECTED, WALLET_CONNECT_UPDATE_SESSION } from './actions';

function* walletConnected({ payload }: AnyAction) {
  yield put({ type: WALLET_CONNECT_UPDATE_SESSION, payload });
}

export default function* appSaga() {
  yield takeLatest(WALLET_CONNECT_CONNECTED, walletConnected);
}
