import { Map } from 'immutable';
import { AnyAction } from 'redux';

import { INITIALIZED, LOADING_START, LOADING_STOP } from './actions';

export const initialState = Map({
  initialized: false,
  loading: true,
});

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case INITIALIZED:
      return state.set('initialized', true);
    case LOADING_START:
      return state.set('loading', true);
    case LOADING_STOP:
      return state.set('loading', false);
    default:
      return state;
  }
};
