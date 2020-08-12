import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import LoadObj from '@/components/LoadObj'
import babylonjs from '@/components/babylonjs'

Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/1',
      name: 'babylonjs',
      component: babylonjs
    },
    {
      path: '/2',
      name: 'threejs',
      component: LoadObj
    }
  ]
})
