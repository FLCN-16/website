import produce from 'immer';
import { AnyAction } from 'redux';

import { CONTACT_SUBMIT, CONTACT_SUCCESS, CONTACT_FAILURE } from './actions';

export const initialState = {
  contact: {
    loading: false,
    success: false,
    error: null,
  },
};

export default (state = initialState, action: AnyAction) =>
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
      default:
        break;
    }
  });
