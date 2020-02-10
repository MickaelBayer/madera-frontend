import axios from 'axios'
import { router } from '../router'
// import { authHeader } from '../security'
// import config from 'config'

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout()
        router.go('/login')
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}

function login(mail, password) {
  return axios.post('/user/sign-up', JSON.stringify({ mail, password }))
    .then(handleResponse)
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user))
      }

      return user
    })
}

function getAll() {
  return axios.get('/user').then(handleResponse)
}

const userService = {
  login,
  logout,
  getAll
}

export default userService
