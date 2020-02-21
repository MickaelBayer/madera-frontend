
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);


const state = {
  displayBtnAccount: false
};


const mutations = {
  displayMyAccount (state){
    state.displayBtnAccount = true;
  },
  hideMyAccount (state){
    state.displayBtnAccount = false;
  }
}

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state,
  mutations,
});
