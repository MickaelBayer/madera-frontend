import axios from 'axios'

export const SERVER_URL = 'http://192.168.1.60:8282'

export const instance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000
})
