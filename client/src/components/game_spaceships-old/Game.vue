<template>
  <div>
    <h1>Game</h1>
    <router-link :to="{ name: 'Home', params: {}}">Home</router-link>
    <router-link :to="{ name: 'GameSpaceshipsClient', params: {}}" target="_blank">New Player</router-link>
    <div>User Connected: {{userConnected}}</div>
    <svg class="battleground" :width="screenWidth" :height="screenHeight">
      <spaceship v-for="gameItem, index in gameItems" :playerId="gameItem" :screenWidth="screenWidth" :screenHeight="screenHeight"
        :index="index">
        </spaceship>
    </svg>
  </div>
</template>
<script>
  import {
    client
  } from '../../deepStream/conn.js'
  import collections from '../../config/collections.json'
  import Spaceship from './Spaceship.vue'

  let configuration = {
    screenWidth: 800,
    screenHeight: 600,
  }
  console.log('collections',collections)
  let gameListRecord = client.record.getList(collections.startships.games + '/game1');
  let userConnectedRecord = client.record.getRecord(collections.users);
  export default {
    name: 'game-spaceships',
    components: {
      Spaceship
    },
    data() {
      return {
        screenWidth: 100,
        screenHeight: 100,
        userConnected: 0,
        gameItems: [],
      }
    },
    created() {
      this.screenWidth = configuration.screenWidth
      this.screenHeight = configuration.screenHeight
      userConnectedRecord.subscribe('value', (value) => {
        console.log('userConnectedData:value', value)
        this.userConnected = value
      })
      gameListRecord.subscribe(players => {
        // console.log('gameListRecord:subscribe', players)
        this.gameItems = players
      })
    },
    mounted() {
    },
    methods: {
    }
  }

</script>
<style>
  .battleground {
    background-color: #ddd;
  }
</style>