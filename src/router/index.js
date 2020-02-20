import Vue from 'vue'
import VueRouter from 'vue-router'
import connection from '../views/Connection.vue'
import home from '../views/Home.vue'
import myAccount from '../views/MyAccount.vue'
import addUser from '../views/AddUser';
import userList from '../views/UserList';
import projectList from '../views/ProjectList';
import createProject from '../views/CreateProject';
import addModule from '../views/AddModule';

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
    { path: '/projectList', component: projectList },
    { path: '/createProject', component: createProject },
    { path: '/addModule', component: addModule },

    // otherwise redirect to home
    //{ path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  // TODO trier les pages qui sont accessible ou non avec connexion
  const publicPages = ['/login', '/']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  next()
})

export default router
