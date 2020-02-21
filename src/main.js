import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from './store/store'

Vue.config.productionTip = false
Vue.use(Vuetify)

export default new Vuetify({ })
new Vue({
  router,
  store,
  render: h => h(App),
  vuetify: new Vuetify()
}).$mount('#app')
