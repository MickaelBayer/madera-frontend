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
      });
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

function getProjectModule(){
  instance.get('/projectModule/project/' + store.state.project.id)
  .then(response => {
    store.commit('setProjectModule', response.data)
  })
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

const projectService = {
  saveProject,
  getProjectModule,
  getProject,
  getProjects,
}

export default projectService