import Axios from 'axios';

const Http = Axios.create({
  baseURL: '/api/',
  timeout: 30000,
});

export default Http;
