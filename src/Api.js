import axios from 'axios'

export const SERVER_URL = 'http://localhost:8282'

export const instance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000
})
