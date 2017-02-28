<template>
  <div>
    <h1>Game</h1>
    <router-link :to="{ name: 'Home', params: {}}">Home</router-link>
    <!--
    <router-link :to="{ name: 'GameSpaceshipsClient', params: {}}" target="_blank">New Player</router-link>
    -->
    <div>User Connected: {{userConnected}}</div>
    <!--
    <svg class="battleground" :width="screenWidth" :height="screenHeight">
      <spaceship v-for="gameItem, index in gameItems" :playerId="gameItem" :screenWidth="screenWidth" :screenHeight="screenHeight"
        :index="index">
        </spaceship>
    </svg>
    -->
    <!-- Players -->
    <div v-if="players.length > 0">
      <div v-for="player in players">
        {{ player }}
        <button @click="fire">Fire</button>
        <button @click="removePlayer">X</button>
      </div>
    </div>
    <div v-else>No players</div>
    <button @click="addPlayer">Add player</button>
    <!-- Player -->
    <div v-if="player">
      {{ player }}
    </div>
    <div v-else>No player</div>
    <!-- Player-Control -->
    <div v-if="playerControl">
      {{ playerControl }}
    </div>
    <div v-else>No playerControl</div>
    <div v-else>No player</div>
    <!-- Bullets -->
    <div v-if="bullets">
      {{ bullets }}
    </div>
    <div v-else>No bullets</div>
    <!-- Bullet -->
    <div v-if="bullet">
      {{ bullet }}
    </div>
    <div v-else>No bullet</div>
    <!-- Battleground -->
    Bullet
    <div v-if="bullet">
      {{ bulletDimensions.x }} {{ bulletDimensions.y }} {{ bullet.position.x }} {{ bullet.position.y }}
    </div>
    <svg :width="battlegroundWidth" :height="battlegroundHeight">
      <rect v-if="player" :width="tankDimensions.x" :height="tankDimensions.y" :x="player.position.x" :y="player.position.y" fill="yellow"
      />
      <rect v-if="bullet && !bullet.destroyed" :width="bulletDimensions.x" :height="bulletDimensions.y" :x="bullet.position.x" :y="bullet.position.y" fill="blue" />
    </svg>
  </div>
</template>
<script>
  import {
    client
  } from '../../deepStream/conn.js'
  import collections from '../../config/collections.json'
  /*
  import Spaceship from './Spaceship.vue'
  */
  import config from './config/config.json'
  console.log('collections', collections)
  // let gameListRecord = client.record.getList(collections.startships.games + '/game1');
  let userConnectedRecord = client.record.getRecord(collections.users);
  let playerRecord = null

  let playersRecord = client.record.getList('startships-players');
  let bulletsRecord = client.record.getList('game-startships-bullets');
  let bulletRecord = client.record.getRecord('game-startships-bullet-0');
  export default {
    name: 'game-spaceships',
    components: {
      // Spaceship
    },
    data() {
      return {
        userConnected: 0,
        gameItems: [],

        playerId: null,
        players: [],
        player: null,
        playerControl: null,
        bullets: null,
        bullet: null,

        battlegroundWidth: 0,
        battlegroundHeight: 0,
        tankDimensions: {
          x: 0,
          y: 0
        },
        bulletDimensions: {
          x: 0,
          y: 0
        }
      }
    },
    created() {
      this.playerId = client.getUid()
      this.battlegroundWidth = config.width
      this.battlegroundHeight = config.height
      this.tankDimensions = config.tankDimensions
      this.bulletDimensions = config.bulletDimensions

      userConnectedRecord.subscribe('value', (value) => {
        console.log('userConnectedData:value', value)
        this.userConnected = value
      })
      /*
      gameListRecord.subscribe(players => {
        // console.log('gameListRecord:subscribe', players)
        this.gameItems = players
      })
      */

      playersRecord.subscribe(players => {
        // console.log('gameListRecord:subscribe', players)
        this.players = players
      })
      bulletsRecord.subscribe(bullets => {
        console.log('bulletsRecord:subscribe', bullets)
        this.bullets = bullets
      })
      bulletRecord.subscribe(bullet => {
        console.log('bulletRecord:subscribe', bullet)
        this.bullet = bullet
      })
    },
    mounted() {},
    methods: {
      addPlayer() {
        client.event.emit('join-game-startships', this.playerId)

        let playerRecord = client.record.getRecord(this.playerId);
        playerRecord.whenReady(() => {
          playerRecord.subscribe(player => {
            this.player = player
          })
        })
        let playerControlRecord = client.record.getRecord(this.playerId + '-control');
        playerControlRecord.whenReady(() => {
          playerControlRecord.subscribe(playerControl => {
            this.playerControl = playerControl
          })
        })
      },
      fire() {
        client.event.emit('fire', this.playerId)
      },
      removePlayer() {
        console.log('leave-game-startships', this.playerId)
        client.event.emit('leave-game-startships', this.playerId)

        this.player = null
        this.playerControl = null
      }
    }
  }

</script>
<style>
  svg {
    background-color: #9ACD32;
  }

</style>
