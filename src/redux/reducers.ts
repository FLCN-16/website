import { combineReducers } from 'redux';

import appReducer from './app/reducer';
import servicesReducer from './services/reducer';

export default combineReducers({
  appReducer,
  servicesReducer,
});
