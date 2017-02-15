<template>
  <circle :cx="item.pos.x" :cy="item.pos.y" r="30" stroke="black" stroke-width="3" fill="red">
  </circle>
</template>

<script>
  import {
    client
  } from '../../deepStream/conn.js'
  import collections from '../../config/collections.json'

  let player = null
  let itemRecord = null

  export default {
    name: 'spaceship',
    props: ['playerId', 'index', 'screenWidth', 'screenHeight'],
    data() {
      return {
        item: {
          pos: {
            x: 0,
            y: 0
          },
          shoot: {
            x: 0,
            y: 0
          }
        },
      }
    },
    created() {
      this.itemRecord = client.record.getRecord(collections.startships.players + '/' + this.playerId)

      this.itemRecord.subscribe((player) => {
        console.log('itemRecord:subscribe', player)
        this.item = player
      })
    }
  }

</script>
<style>

</style>