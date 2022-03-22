export const CONTACT_SUBMIT = 'SERIVCE:CONTACT:SUBMIT';
export const CONTACT_SUCCESS = 'SERIVCE:CONTACT:SUCCESS';
export const CONTACT_FAILURE = 'SERIVCE:CONTACT:FAILURE';

export const contactSubmit = (data: any) => ({
  type: CONTACT_SUBMIT,
  payload: data,
});
