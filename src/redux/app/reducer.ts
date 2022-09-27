import produce from 'immer';
import { AnyAction } from 'redux';

import { INITIALIZED, LOADING_START, LOADING_STOP } from './actions';

export const initialState = {
  initialized: false,
  loading: true,
};

const appReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case INITIALIZED:
        draft.initialized = true;
        break;
      case LOADING_START:
        draft.loading = true;
        break;
      case LOADING_STOP:
        draft.loading = false;
        break;
      default:
        break;
    }
  });

export default appReducer