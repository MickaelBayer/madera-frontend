import { instance } from '../Api'
import store from '../store/store'

function saveProject(name, range, customer, user) {
  console.log({ name: name, range: range, customer: customer, user: user})
  return instance.post('/project', { name: name,
                                    range: range,
                                    customer: customer,
                                    user: user.id})
    .then(response => {
      if (response.status === 201) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Projet correctement ajouté.'
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

const projectService = {
  saveProject,
}

export default projectService