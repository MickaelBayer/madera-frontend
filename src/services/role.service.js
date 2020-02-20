import { router } from '../router'
import { instance } from '../Api'

function getAll() {
  return instance.get('/role')
}

const roleService = {
  getAll,
}

export default roleService
