import { router } from '../router'
import { instance } from '../Api'

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
  instance.defaults.headers.common['Authorization'] = null
}

function login(mail, password) {
  instance.post('/login', {mail: mail, password: password})
  .then(response => {
    if (response.status === 200) {
      localStorage.setItem('user', JSON.stringify(response.data))
      instance.defaults.headers.common['Authorization'] = response.data.token
      router.push('/home')
    }
  })
  .catch(error => {
    console.log(error)
    if(error.status === 401 ) {
      // auto logout if 401 response returned from api
      logout()
      router.push('/login')
    }
    else {
      console.log(error)
    }
  })
}

/*
function getAll() {
  return instance.get('/user').then(handleResponse)
}
*/

const userService = {
  login,
  logout,
  // getAll
}

export default userService
