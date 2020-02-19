import { router } from '../router'
import { instance } from '../Api'

function getAll() {
  return instance.get('/role/find')
}

const roleService = {
  getAll,
}

export default roleService
