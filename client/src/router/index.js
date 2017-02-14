import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Game from 'components/Game'
import GameClient from 'components/GameClient'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/game',
      name: 'Game',
      component: Game
    },
    {
      path: '/game-client',
      name: 'GameClient',
      component: GameClient
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
