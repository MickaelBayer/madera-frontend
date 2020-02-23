import { instance } from '../Api'
import store from '../store/store'

function getAll() {
  return instance.get('/module')
}

function getComponents() {
  return instance.get('/component')
}

const moduleService = {
  getAll,
  getComponents,
}

export default moduleService