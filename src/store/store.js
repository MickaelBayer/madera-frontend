
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);


const state = {
  displayBtnAccount: false,
  user: null,
  customer: null,
};


const mutations = {
  displayMyAccount (state){
    state.displayBtnAccount = true;
  },
  hideMyAccount (state){
    state.displayBtnAccount = false;
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
}

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state,
  mutations,
});
