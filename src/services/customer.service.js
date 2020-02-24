import { instance } from '../Api'
import store from '../store/store'

function getAll() {
  return instance.get('/customer')
}

function create(firstname, lastname, phone, address, mail) {
  return instance.post('/customer', { firstName: firstname, lastName: lastname, phone: phone, address: address, mail: mail })
          .then(response => {
            if (response.status === 201) {
              store.commit('setCustomer', response.data)
              return {
                status: 'success',
                icon: 'check_circle',
                msg: 'Client correctement ajouté.'
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
            }else if(error.response.status === 409){
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

function saveCustomer(customer) {
  return instance.post('/customer', customer)
    .then(response => {
      if (response.status === 201) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Client correctement ajouté.'
        }
      }
    })
    .catch(error => {
      if(error.response.status === 401 ) {
        return {
          status: 'error',
          icon: 'error',
          msg: 'Paramètre incorrect.'
        }
      }
      else {
        return {
          status: 'error',
          icon: 'error',
          msg: 'Erreur au niveau du server.'
        }
      }
    })
}

function updateCustomer(customer) {
  return instance.put('/customer', customer)
    .then(response => {
      if (response.status === 201) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Client correctement mis à jour.'
        }
      }
    })
    .catch(error => {
      if(error.response.status === 401 ) {
        return {
          status: 'error',
          icon: 'error',
          msg: 'Paramètre incorrect.'
        }
      }
      else {
        return {
          status: 'error',
          icon: 'error',
          msg: 'Erreur au niveau du server.'
        }
      }
    })
}

function deleteCustomer(customer) {
  return instance.delete('/customer/' + customer.id)
    .then(response => {
      if (response.status === 200) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Client correctement supprimé.'
        }
      }
    })
    .catch(error => {
      if(error.response.status === 401 ) {
        return {
          status: 'error',
          icon: 'error',
          msg: 'Paramètre incorrect.'
        }
      }
      else {
        return {
          status: 'error',
          icon: 'error',
          msg: 'Erreur au niveau du server.'
        }
      }
    })
}

const customerService = {
  getAll,
  create,
  saveCustomer,
  updateCustomer,
  deleteCustomer,
}

export default customerService
