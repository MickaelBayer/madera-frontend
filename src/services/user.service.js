import { router } from '../router'
import { instance } from '../Api'
import store from '../store/store'

function logout() {
  // remove user from local storage to log user out
  instance.defaults.headers.common['Authorization'] = null
  store.commit('hideMyAccount')
  store.commit('deleteUser')
  store.commit('deleteCustomer')
  router.push('/login')
}

function login(mail, password) {
  return instance.post('/login', {mail: mail, password: password})
  .then(response => {
    if (response.status === 200) {
      store.commit('displayMyAccount')
      store.commit('setUser', response.data)
      instance.defaults.headers.common['Authorization'] = response.data.token
      if(response.data.isActiv === 'true'){
        if(response.data.isFirstConnection === 'true') {
          router.push('/login/firstConnection')
        } else {
          router.push('/home')
        }
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Connexion réussie'
        }
      } else {
        return {
          status: 'error',
          icon: 'error',
          msg: 'Connexion impossible, votre compte est désactivé.'
        }
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
  return instance.post('/user/sign-up', {firstName: firstname, lastName: lastname, mail: mail, password: password, phone: phone, role: role, firstConnection: true, isActiv: true})
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

function updInfoUser(id, lastname, firstname, phone, mail) {
  return instance.post('/user/upduserinfo', {id: id, lastName: lastname, firstName: firstname, phone: phone, mail: mail})
    .then(response => {
      if (response.status === 200) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Informations mise à jour'
        }
      }
    })
    .catch(error => {
      console.log(error)
      return {
        status: 'error',
        icon: 'error',
        msg: 'Erreur au niveau du server'
      }
    })
}

function resetPwd(email) {
  return instance.get(`/user/resetmdpuser/${email}`)
}

function getAll() {
  return instance.get(`/user`)
}

function changeStateUser(id, activ) {
  return instance.post('/user/changeStateUser', {id: id, isActiv: activ})
    .then(response => {
      if (response.status === 200) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Informations mise à jour'
        }
      }
    })
    .catch(error => {
      console.log(error)
      return {
        status: 'error',
        icon: 'error',
        msg: 'Erreur au niveau du server'
      }
    })
}


const userService = {
  login,
  logout,
  signup,
  getInfoById,
  updPassword,
  updInfoUser,
  resetPwd,
  getAll,
  changeStateUser
}

export default userService
