<template>
  <div id="box" v-if="connectionState === 'OPEN'">
    <Fullscreen/>
    <Move @update="updatePosMove" />
    <Shoot @update="updatePosShoot" />
    <div class="info">Move: {{ posMove.x }} - {{ posMove.y }} </div>
    <div class="info">Shoot: {{ posShoot.x }} - {{ posShoot.y }} </div>
    <div class="info">{{ connectionState }}</div>
  </div>
  <div v-else>
    <div id="box" class="info">{{ connectionState }}</div>
  </div>
</template>
<script>
  import {
    client,
    getUserId
  } from '../../deepStream/conn.js'
  import collections from '../../config/collections.json'
  import Shoot from '../controls/Shoot.vue'
  import Move from '../controls/Move.vue'
  import Fullscreen from '../controls/Fullscreen.vue'

  let gameListRecord = null
  let myInterval = null
  let millisecondsInterval = 1 / 60

  export default {
    data() {
      return {
        userId: null,
        setTimeOut: 1000,
        connectionState: '',
        posMove: {
          x: 0,
          y: 0
        },
        posShoot: {
          x: 0,
          y: 0
        },
        aux: 0
      }
    },
    created() {
      gameListRecord = client.record.getList(collections.startships.game + '/game1')

      this.userId = getUserId()
      gameListRecord.addEntry(this.userId)

      client.on('connectionStateChanged', (state) => {
        this.connectionState = state
      })

      console.log('millisecondsInterval', millisecondsInterval)
      myInterval = setInterval(() => {
        this.sendPostion()
      }, millisecondsInterval);
    },
    destroyed() {
      console.log('DESTROYED')
      gameListRecord.removeEntry(this.userId)
    },
    methods: {
      updatePosMove(pos) {
        this.posMove = pos
        // this.sendPostion()
      },
      updatePosShoot(pos) {
        this.posShoot = pos
        // this.sendPostion()
      },
      isValidPosition() {
        return this.posMove.x !== 0 ||
          this.posMove.y !== 0 ||
          this.posShoot.x !== 0 ||
          this.posShoot.y !== 0
      },
      sendPostion() {
        if (this.isValidPosition()) {
          this.send = false
          const data = {
            player: this.userId,
            move: this.posMove,
            shoot: this.posShoot
          }
          console.log('setPlayerPosition', data)
          client.rpc.make('setPlayerPosition', data, (error, result) => {
            if (error) {
              console.log('setPlayerPosition', 'error', error)
            }
          })
        }
        // setInterval(this.sendPostion, this.setTimeOut)
      }
    },
    destroy() {
      clearInterval(this.myInterval);
    },
    components: {
      Shoot,
      Move,
      Fullscreen
    }
  }

</script>
<style scoped>
  #box {
    height: 100%;
    margin: 0;
    padding: 0;
    min-height: 100%;
    overflow: hidden;
    background-color: #111;
    cursor: default;
    display: flex;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  
  #box>svg {
    width: 50%;
    /*height: 50%;*/
  }
  
  .info {
    color: white;
  }

</style>
