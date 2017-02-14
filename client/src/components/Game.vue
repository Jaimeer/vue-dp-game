<template>
  <div>
    <h1>Game</h1>
    <router-link :to="{ name: 'Home', params: {}}">Home</router-link>
    <div>User Connected: {{userConnected}}</div>
    <div id="game-battleground"></div>
    <game-item v-for="gameItem, index in gameItems" :playerId="gameItem" @playerCreated="playerCreated" :screenWidth="screenWeight"
      :screenHeight="screenHeight" :index="index" @changePossition="changePossition">
      </game-item>
  </div>
</template>
<script>
  import {
    client
  } from '../deepStream/conn.js'
  import GameItem from './GameItem.vue'
  import pixijs from 'pixi.js'
  let gameListRecord = client.record.getList('game-players/game1');
  let userConnectedRecord = client.record.getRecord('user-connections');
  export default {
    name: 'game',
    components: {
      GameItem
    },
    data() {
      return {
        screenWeight: 800,
        screenHeight: 600,
        userConnected: 0,
        gameItems: [],
        gamePlayers: [],
        gamePlayersPosition: [],
        app: null
      }
    },
    created() {
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
      var app = new PIXI.Application(this.screenWeight, this.screenHeight, { backgroundColor: 0x1099bb })

      console.log('aaa', document.getElementById('game-battleground'))
      document.getElementById('game-battleground').appendChild(app.view)

      // Listen for animate update
      app.ticker.add(function (delta) {
        console.log('tick')
        // just for fun, let's rotate mr rabbit a little
        // delta is 1 if running at 100% performance
        // creates frame-independent tranformation
        // bunny.rotation += 0.1 / delta;
        const index = 0
        if (this.gamePlayers[index]) {
          this.gamePlayers[index].x = this.gamePlayersPosition[index].x
          this.gamePlayers[index].y = this.gamePlayersPosition[index].y
        }
      });

      this.app = app
    },
    methods: {
      playerCreated(data) {
        console.log('playerCreated', data)
        this.gamePlayers[data.index] = data.player
        this.app.stage.addChild(data.player);
      },
      changePossition(data) {
        console.log('changePossition', this.gamePlayers[data.index], data)
        this.gamePlayersPosition[data.index] = {}
        this.gamePlayersPosition[data.index].x = data.item.postX
        this.gamePlayersPosition[data.index].y = data.item.postY

      }
    }
  }

</script>
<style>
  .battleground {
    width: 500px;
    height: 500px;
    background-color: #ddd;
  }
</style>