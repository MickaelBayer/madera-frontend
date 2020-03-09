import axios from 'axios';
import store from './store/store';

export const SERVER_URL = 'http://172.20.10.2:8282';

export const instance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000
});

instance.interceptors.request.use(
  (config) => {
    let user = store.state.user;
    if (user) {
      let token = user.token
      config.headers['Authorization'] = `Bearer ${ token }`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

//export default instance;
