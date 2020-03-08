import { instance } from '../Api'
import store from '../store/store'

function saveProject() {
  return instance.post('/project', { name: store.state.project.name,
                                     ranges: store.state.project.ranges,
                                     customer: store.state.customer,
                                     commercial: {
                                      id: Number(store.state.user.userID),
                                    }
                                  })
    .then(response => {
      store.commit('setProject', response.data)
      store.state.projectModules.forEach(async (element) => {
        element.project = response.data
        await instance.post('/projectModule', element)
        .catch(error => {
          console.log(error)
        })
      })
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

function setProjectModules(){
  instance.get('/projectModule/project/' + store.state.project.id)
  .then(response => {
    store.commit('setProjectModules', response.data)
  })
}

function getProjectModules(id){
  return instance.get('/projectModule/project/' + id)
}

function getProject(id){
  instance.get('/project/' + id)
  .then(response => {
    store.commit('setProject', response.data)
  })
}

function getProjects(){
  return instance.get('/project')
}

function deleteProject(project) {
  return instance.delete('/project/' + project.id)
    .then(response => {
      if (response.status === 200) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Project correctement supprimé.'
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

function saveQuotation(price) {
  return instance.post("quotation", { totalPrice: Number(price),
                                      state:{ id: 1 },
                                      discount: 0,
                                      project: { id: store.state.project.id } })
}

function getProjectQuotation(id){
  return instance.get('/quotation/project/' + id)
}

function getStates(){
  return instance.get('/quotationState')
}

function updateState(state) {
  state.state = {id: state.state}
  return instance.put('/quotation/', state)
    .then(response => {
      if (response.status === 200) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Devis correctement mis à jour.'
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
  getProjectModules,
  getProject,
  getProjects,
  setProjectModules,
  deleteProject,
  saveQuotation,
  getProjectQuotation,
  getStates,
  updateState,
}

export default projectService