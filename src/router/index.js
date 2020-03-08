import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'
import connection from '../views/Connection.vue'
import home from '../views/Home.vue'
import myAccount from '../views/MyAccount.vue'
import addUser from '../views/AddUser'
import userList from '../views/UserList'
import projectList from '../views/ProjectList'
import createProject from '../views/CreateProject'
import addModule from '../views/AddModule'
import listCustomers from '../views/ListCustomers'
import firstConnection from '../views/FirstConnection'
import listModules from '../views/ListModules'
import listComponents from '../views/ListComponents'
import listProviders from '../views/ListProviders'
import listProjects from '../views/ListProjects'

Vue.use(VueRouter)

export const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: connection },
    { path: '/login', component: connection },
    { path: '/home', component: home },
    { path: '/adduser', component: addUser },
    { path: '/account', component: myAccount },
    { path: '/userlist', component: userList },
    { path: '/createProject', component: createProject },
    { path: '/addModule', component: addModule },
    { path: '/login/firstConnection', component: firstConnection},
    { path: '/listCustomers', component: listCustomers},
    { path: '/listModules', component: listModules },
    { path: '/listComponents', component: listComponents },
    { path: '/listProviders', component: listProviders},
    { path: '/listProjects', component: listProjects },
    //{ path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page

  const publicPages = ['/login', '/']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = store.state.user

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  next()
})

export default router
