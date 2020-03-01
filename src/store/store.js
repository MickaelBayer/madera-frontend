
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);


const state = {
  displayBtnAccount: false,
  displayTabsBE: false,
  user: null,
  customer: null,
  project: null,
  projectModules: [],
  positionModule: 1,
};


const mutations = {
  displayMyAccount (state){
    state.displayBtnAccount = true;
  },
  hideMyAccount (state){
    state.displayBtnAccount = false;
  },
  displayTabsBE (state){
    state.displayTabsBE = true;
  },
  hideTabsBE (state){
    state.displayTabsBE = false;
  },
  setUser (state, user){
    state.user = user
  },
  deleteUser (state){
    state.user = null
  },
  setCustomer (state, customer){
    state.customer = customer
  },
  deleteCustomer (state){
    state.customer = null
  },
  setProject (state, project){
    state.project = project
  },
  deleteProject (state){
    state.project = null
  },
  setProjectRange (state, range){
    state.project.ranges = range
  },
  deleteProjectRange (state){
    state.project.ranges = null
  },
  setProjectName (state, name){
    state.project.name = name
  },
  deleteProjectName (state){
    state.project.name = null
  },
  setProjectModules(state, projectModules){
    state.projectModules = projectModules
  },
  deleteProjectModules(state){
    state.projectModules = null
  },
  addModuleToProject(state, module){
    state.projectModules.push(module)
  },
  deleteModuleFromProject(state, module){
    state.projectModules.splice(state.projectModules.findIndex(x => x.position === module.position), 1)
  },
  incrementPositionModule(state){
    state.positionModule++
  },
  decrementPositionModule(state){
    state.positionModule--
  },
  resetPositionModule(state){
    state.positionModule = 1
  }
}

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state,
  mutations,
});
