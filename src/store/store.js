
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);


const state = {
  displayBtnAccount: false,
  login401: false,
};


const mutations = {
  displayMyAccount (state){
    state.displayBtnAccount = true;
  },
  hideMyAccount (state){
    state.displayBtnAccount = false;
  },
  seeLogin401 (state){
    state.login401 = true;
    setTimeout(function(){ state.login401 = false; }, 2000);
  }
}

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state,
  mutations,
});
