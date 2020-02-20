import { router } from '../router'
import { instance } from '../Api'

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
  instance.defaults.headers.common['Authorization'] = null
  location.reload()
}

function login(mail, password) {
  instance.post('/login', {mail: mail, password: password})
  .then(response => {
    if (response.status === 200) {
      localStorage.setItem('user', JSON.stringify(response.data))
      instance.defaults.headers.common['Authorization'] = response.data.token
      router.push('/home')
      location.reload()
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

function signup(firstname, lastname, mail, password, phone, role) {
  instance.post('/user/sign-up', {firstName: firstname, lastName: lastname, mail: mail, password: password, phone: phone, role: role})
    .then(response => {
      console.log(response.status)
      if (response.status === 201) {
        router.push('/home')
      }
    })
    .catch(error => {
      console.log(error)
      if(error.status === 401 ) {
        console.log("erreur 401")
      }else if(error.status === 500){
        console.log('erreur 500')
      }
      else {
        console.log(error)
        return 'Erreur'
      }
    })
}

const userService = {
  login,
  logout,
  signup
  // getAll
}

export default userService
