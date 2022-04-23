import { combineReducers } from 'redux';

import appReducer from './app/reducer';
import servicesReducer from './services/reducer';
import walletConnect from './walletConnect/reducer';

export default combineReducers({
  appReducer,
  servicesReducer,
  walletConnect,
});
