import { instance } from '../Api'
import store from '../store/store'

function getModules() {
  return instance.get('/module')
}

function getComponents() {
  return instance.get('/component')
}

function getCctps() {
  return instance.get('/cctp')
}

function getComponentsWithFamiliesAndRange(moduleFamily, ranges){
  return instance.get('/component/'+ moduleFamily + '/' + ranges)
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

function getComponentsFamilies() {
  return instance.get('/componentFamily')
}

function getModulesFamilies() {
  return instance.get('/moduleFamily')
}

function getProviders() {
  return instance.get('/provider')
}

function saveProvider(provider) {
  return instance.post('/provider', provider)
    .then(response => {
      if (response.status === 201) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Fournisseur correctement ajouté.'
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

function updateProvider(provider) {
  return instance.put('/provider', provider)
    .then(response => {
      if (response.status === 201) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Fournisseur correctement mis à jour.'
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

function deleteProvider(provider) {
  return instance.delete('/provider/' + provider.id)
    .then(response => {
      if (response.status === 200) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Fournisseur correctement supprimé.'
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

function getRanges() {
  return instance.get('/ranges')
}

function saveModule(module) {
  return instance.post('/module', { name: module.name,
                                    startingPrice: module.startingPrice,
                                    specs: module.specs,
                                    cctp: module.cctp,
                                    info: module.info,
                                    ranges: module.ranges,
                                    family: module.family,
                                    components: module.selectedComponents,
                                  })
    .then(response => {
      if (response.status === 201) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Module correctement ajouté.'
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

function updateIsActive(module, isActive) {
  // let uri;
  // if (isActive) {
  //   uri = '/module/' + module.id + '/activate'
  // }
  // else {
  //   uri = '/module/' + module.id + '/desactivate'
  // }
  module.active = isActive
  return instance.put('/module', module)
    .then(response => {
      if (response.status === 201) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Module correctement mis à jour.'
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

function deleteModule(module) {
  return instance.delete('/module/' + module.id)
    .then(response => {
      if (response.status === 200) {
        return {
          status: 'success',
          icon: 'check_circle',
          msg: 'Module correctement supprimé.'
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

function getComponentByModule(module) {
  return instance.get('/component/module/'+ module.id)
}

const moduleService = {
  getModules,
  getComponentsFamilies,
  getModulesFamilies,
  getComponents,
  getComponentsWithFamiliesAndRange,
  saveComponent,
  updateComponent,
  deleteComponent,
  getProviders,
  saveProvider,
  updateProvider,
  deleteProvider,
  getRanges,
  getCctps,
  saveModule,
  deleteModule,
  getComponentByModule,
  updateIsActive,
}

export default moduleService
