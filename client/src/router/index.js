import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import GameSpaceships from '../components/game_spaceships/Game'
import GameSpaceshipsClient from '../components/game_spaceships/Client.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/spaceships',
      name: 'GameSpaceships',
      component: GameSpaceships
    },
    {
      path: '/spaceships/player',
      name: 'GameSpaceshipsClient',
      component: GameSpaceshipsClient
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
