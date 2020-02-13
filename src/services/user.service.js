import { router } from '../router'
import { instance } from '../Api'

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
  instance.defaults.headers.common['Authorization'] = null
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
  instance.post('/login', {mail: mail, password: password})
  .then(response => {
    if (response.status === 200) {
      localStorage.setItem('user', JSON.stringify(response.data))
      instance.defaults.headers.common['Authorization'] = response.data.token
      //router.go('/home')
    }
  })
  .catch(error => {
    console.log(error)
    if(error.status === 401 ) {
      // auto logout if 401 response returned from api
      logout()
      router.go('/login')
    }
    else {
      console.log(error)
    }
  })
}

function getAll() {
  return instance.get('/user').then(handleResponse)
}

const userService = {
  login,
  logout,
  getAll
}

export default userService
