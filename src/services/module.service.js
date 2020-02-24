import { instance } from '../Api'
import store from '../store/store'

function getAll() {
  return instance.get('/module')
}

function getComponents() {
  return instance.get('/component')
}

function saveComponent(component) {
  return instance.post('/component', component)
    .then(response => {
      if (response.status === 201) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Composant correctement ajouté.'
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

function updateComponent(component) {
  return instance.put('/component', component)
    .then(response => {
      if (response.status === 201) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Composant correctement mis à jour.'
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

function deleteComponent(component) {
  return instance.delete('/component/' + component.id)
    .then(response => {
      if (response.status === 200) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Composant correctement supprimé.'
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

function getFamilies() {
  return instance.get('/componentFamily')
}

const moduleService = {
  getAll,
  getComponents,
  getFamilies,
  saveComponent,
  updateComponent,
  deleteComponent,
}

export default moduleService