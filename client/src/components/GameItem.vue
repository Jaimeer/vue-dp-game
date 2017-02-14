<template>
  <g v-if="item">
    <circle class="" r="10" :cx="item.posX" :cy="item.posY" />
    <div>{{item}}</div>
  </g>
</template>

<script>
  import {
    client
  } from '../deepStream/conn.js'
  export default {
    name: 'game-item',
    props: ['playerId'],
    data() {
      return {
        item: null,
        itemRecord: null
      }
    },
    created() {
      this.itemRecord = client.record.getRecord('game-player-item/' + this.playerId)

      this.itemRecord.subscribe((player) => {
        // console.log('itemRecord:subscribe', player)
        this.item = player
      })
    }
  }

</script>
<style>

</style>