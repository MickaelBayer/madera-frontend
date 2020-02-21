import { router } from '../router'
import { instance } from '../Api'
import store from '../store/store'

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
  instance.defaults.headers.common['Authorization'] = null
  router.push('/login')
  store.commit('hideMyAccount')
}

function login(mail, password) {
  instance.post('/login', {mail: mail, password: password})
  .then(response => {
    if (response.status === 200) {
      store.commit('displayMyAccount')
      localStorage.setItem('user', JSON.stringify(response.data))
      instance.defaults.headers.common['Authorization'] = response.data.token
      router.push('/home')
    }
  })
  .catch(error => {
    if(error.response.status === 401 ) {
      console.log('mot de passe incorrect')
      store.commit('seeLogin401')
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
      if(error.response.status === 401 ) {
        console.log("erreur 401")
      }else if(error.response.status === 500){
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
}

export default userService
