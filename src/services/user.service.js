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
  return instance.post('/login', {mail: mail, password: password})
  .then(response => {
    if (response.status === 200) {
      store.commit('displayMyAccount')
      localStorage.setItem('user', JSON.stringify(response.data))
      instance.defaults.headers.common['Authorization'] = response.data.token
      router.push('/home')
      return {
        status: 'success',
        icon: 'check_circle',
        msg: 'Connexion réussie'
      }
    }
  })
  .catch(error => {
    if(error.response.status === 401 ) {
      return {
        status: 'error',
        icon: 'error',
        msg: 'Adresse mail ou mot de passe incorrect'
      }
    }
    return {
      status: 'error',
      icon: 'error',
      msg: 'Erreur au niveau du server'
    }
  })
}

function signup(firstname, lastname, mail, password, phone, role) {
  return instance.post('/user/sign-up', {firstName: firstname, lastName: lastname, mail: mail, password: password, phone: phone, role: role})
    .then(response => {
      if (response.status === 201) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Utilisateur correctement ajouté. Le mot de passe par défaut est : Madera123'
        }
      }
    })
    .catch(error => {
      console.log(error)
      if(error.response.status === 401 ) {
        return {
          status: 'error',
          icon: 'error',
          msg: 'Paramètre incorrect'
        }
      }else if(error.response.status === 500){
        return {
          status: 'error',
          icon: 'error',
          msg: 'Adresse mail déjà utilisée'
        }
      }
      else {
        return {
          status: 'error',
          icon: 'error',
          msg: 'Erreur au niveau du server'
        }
      }
    })
}

const userService = {
  login,
  logout,
  signup
}

export default userService
