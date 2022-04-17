export const CONTACT_SUBMIT = 'SERIVCE:CONTACT:SUBMIT';
export const CONTACT_SUCCESS = 'SERIVCE:CONTACT:SUCCESS';
export const CONTACT_FAILURE = 'SERIVCE:CONTACT:FAILURE';
export const HIRE_SUBMIT = 'SERIVCE:HIRE:SUBMIT';
export const HIRE_SUCCESS = 'SERIVCE:HIRE:SUCCESS';
export const HIRE_FAILURE = 'SERIVCE:HIRE:FAILURE';

export const contactSubmit = (data: any) => ({
  type: CONTACT_SUBMIT,
  payload: data,
});

export const hireSubmit = (data: any) => ({
  type: HIRE_SUBMIT,
  payload: data,
});