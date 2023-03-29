import produce from 'immer';
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

export const initialState = {
  contact: {
    loading: false,
    success: false,
    error: null,
  },
  hire: {
    loading: false,
    success: false,
    error: null,
  },
};

const serviceReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONTACT_SUBMIT:
        draft.contact.loading = true;
        break;
      case CONTACT_SUCCESS:
        draft.contact.loading = false;
        draft.contact.success = true;
        break;
      case CONTACT_FAILURE:
        draft.contact.loading = false;
        draft.contact.success = false;
        draft.contact.error = action.error;
        break;
      case CONTACT_RESET:
        draft.contact = initialState.contact;
        break;
      case HIRE_SUBMIT:
        draft.hire.loading = true;
        break;
      case HIRE_SUCCESS:
        draft.hire.loading = false;
        draft.hire.success = true;
        break;
      case HIRE_FAILURE:
        draft.hire.loading = false;
        draft.hire.success = false;
        draft.hire.error = action.error;
        break;
      case HIRE_RESET:
        draft.hire = initialState.hire;
        break;
      default:
        break;
    }
  });

export default serviceReducer;