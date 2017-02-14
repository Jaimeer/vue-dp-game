<template>
  <div id="player"></div>
</template>

<script>
  import {
    client
  } from '../deepStream/conn.js'
  export default {
    name: 'game-item',
    props: ['playerId', 'index', 'screenWidth', 'screenHeight'],
    data() {
      return {
        item: null,
        itemRecord: null,
        player: null
      }
    },
    created() {
      this.itemRecord = client.record.getRecord('game-player-item/' + this.playerId)

      this.itemRecord.subscribe((player) => {
        // console.log('itemRecord:subscribe', player)
        this.item = player
        this.$emit('changePossition', {
          index: this.index,
          item: this.item
        })
      })
    },
    mounted() {
      // create a new Sprite from an image path
      this.player = PIXI.Sprite.fromImage('/static/img/spaceship-body.png')

      // center the sprite's anchor point
      this.player.anchor.set(0.5);

      // move the sprite to the center of the screen
      this.player.x = this.screenWidth / 2;
      this.player.y = this.screenHeight / 2;

      console.log('PRE EMIT')
      this.$emit('playerCreated', {
        index: this.index,
        player: this.player
      })
    }
  }

</script>
<style>

</style>