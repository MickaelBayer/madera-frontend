import { router } from '../router'
import { instance } from '../Api'
import store from '../store/store'

function logout() {
  // remove user from local storage to log user out
  instance.defaults.headers.common['Authorization'] = null
  store.commit('hideMyAccount')
  store.commit('deleteUser')
  router.push('/login')
}

function login(mail, password) {
  return instance.post('/login', {mail: mail, password: password})
  .then(response => {
    if (response.status === 200) {
      store.commit('displayMyAccount')
      store.commit('setUser', response.data)
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

function getInfoById(id) {
  return instance.get(`/user/${id}`)
}

function updPassword(password, id) {
  return instance.post('/user/updpwd', { password: password, id: id})
    .then(response => {
      if (response.status === 200) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Mot de passe mis à jour avec succés ! Vous allez être déconnecté dans 5s.'
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
          msg: 'Erreur 500'
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
  signup,
  getInfoById,
  updPassword
}

export default userService
