import produce from 'immer';
import { AnyAction } from 'redux';

import {
  WALLET_CONNECT_CONNECT,
  WALLET_CONNECT_CONNECTED,
  WALLET_CONNECT_DISCONNECT,
  WALLET_CONNECT_DISCONNECTED,
  WALLET_CONNECT_UPDATE_SESSION,
} from './actions';

export const initialState = {
  loading: true,
  connected: false,
  session: {},
};

export default (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case WALLET_CONNECT_CONNECT:
        draft.connected = false;
        break;
      case WALLET_CONNECT_CONNECTED:
        draft.connected = true;
        break;
      case WALLET_CONNECT_DISCONNECT:
      case WALLET_CONNECT_DISCONNECTED:
        draft.connected = false;
        draft.session = {};
        break;
      case WALLET_CONNECT_UPDATE_SESSION:
        draft.session = action.payload;
      default:
        break;
    }
  });
