<template>
  <div>
    <h1>Game</h1>
    <router-link :to="{ name: 'Home', params: {}}">Home</router-link>
    <div>User Connected: {{userConnected}}</div>
  </div>
</template>
<script>
  import {
    client
  } from '../deepStream/conn.js'
  let gameListRecord = client.record.getList('game-players/game1');
  let userConnectedRecord = client.record.getRecord('user-connections');
  export default {
    name: 'game',
    data() {
      return {
        userConnected: 0
      }
    },
    created() {
      userConnectedRecord.subscribe('value', (value) => {
        console.log('userConnectedData:value', value)
        this.userConnected = value
      })
    }
  }

</script>
<style>


</style>
