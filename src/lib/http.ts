import Axios from 'axios';

const Http = Axios.create({
  baseURL: '/api/',
  timeout: 1000,
});

export default Http;
