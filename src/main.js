import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;
Vue.use(Vuetify);
export default new Vuetify({ });
new Vue({
  router,
  render: h => h(App),
  vuetify: new Vuetify(),
}).$mount('#app');
