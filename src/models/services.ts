import Http from '../lib/http';

interface IContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const contact = async (data: IContactData) => {
  return await Http.post('/service/contact/', data);
};
