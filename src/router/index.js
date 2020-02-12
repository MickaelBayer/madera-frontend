import Vue from 'vue'
import VueRouter from 'vue-router'
import connection from '../views/Connection.vue'
import home from '../views/Home.vue'

Vue.use(VueRouter)

export const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: connection },
    { path: '/login', component: connection },
    { path: '/home', component: home },

    // otherwise redirect to home
    //{ path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  // TODO supprimer home de la liste des page publiques
  const publicPages = ['/login', '/', '/home']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  next()
})

export default router
