import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/main'
import user from '../components/user'
import dynamic from '../components/dynamic'
import searchResult from '../components/searchResult'

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'router-link-active',
  routes: [
    {
      path: '/',
      component: Main
    },
    {
      path: '/dynamic',
      component: dynamic
    },
    {
      path: '/main',
      component: Main
    },
    {
      path: '/user',
      component: user
    },
    {
      path: '/search',
      query: {key: ' '},
      component: searchResult
    }
  ]
})
