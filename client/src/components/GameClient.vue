<template>
  <div id="box">
    <!-- <Fullscreen/> -->
    <Move @update="updatePosMove" />
    <Shoot @update="updatePosShoot" />
    <div>Move: {{ posMove.x }} - {{ posMove.y }}</div>
    <div>Move: {{ posShoot.x }} - {{ posShoot.y }}</div>
  </div>
</template>
<script>
  import {
    client,
    getUserId
  } from '../deepStream/conn.js'
  import Shoot from './controls/Shoot.vue'
  import Move from './controls/Move.vue'
  // import Fullscreen from 'Fullscreen'

  let gameListRecord = client.record.getList('game-players/game1')

  export default {
    data() {
      return {
        userId: null,
        posMove: {
          x: 0,
          y: 0
        },
        posShoot: {
          x: 0,
          y: 0
        }
      }
    },
    created () {
      this.userId = getUserId()
      gameListRecord.addEntry(this.userId)
    },
    destroyed(){
      gameListRecord.removeEntry(this.userId)
    },
    methods: {
      updatePosMove(pos) {
        this.posMove = pos
        this.sendPostion()
      },
      updatePosShoot(pos) {
        this.posShoot = pos
        this.sendPostion()
      },
      sendPostion() {
        const data = {
          player: this.userId,
          posMove: this.posMove,
          posShoot: this.posShoot
        }
        client.rpc.make('setPlayerPosition', data, (error, result) => {
          console.log('setPlayerPosition', 'error', error, 'result', result)
        })
      }
    },
    components: {
      Shoot,
      Move
      // Fullscreen
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

</style>
