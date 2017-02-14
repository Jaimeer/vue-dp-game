<template>
  <div>
    <h1>Game</h1>
    <router-link :to="{ name: 'Home', params: {}}">Home</router-link>
    <div>User Connected: {{userConnected}}</div>
    <svg class="battleground">
      <game-item v-for="gameItem in gameItems" :playerId="gameItem"></game-item>
    </svg>
  </div>
</template>
<script>
  import {
    client
  } from '../deepStream/conn.js'
  import GameItem from './GameItem.vue'
  let gameListRecord = client.record.getList('game-players/game1');
  let userConnectedRecord = client.record.getRecord('user-connections');
  export default {
    name: 'game',
    components: {
      GameItem
    },
    data() {
      return {
        userConnected: 0,
        gameItems: []
      }
    },
    created() {
      userConnectedRecord.subscribe('value', (value) => {
        console.log('userConnectedData:value', value)
        this.userConnected = value
      })
      gameListRecord.subscribe( players => {
        // console.log('gameListRecord:subscribe', players)
        this.gameItems = players
      })
    }
  }

</script>
<style>
  .battleground{
    width: 500px;
    height: 500px;
    background-color: #ddd;
  }

</style>
