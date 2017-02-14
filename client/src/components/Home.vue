<template>
  <div>
    <h1>Home</h1>
    <router-link :to="{ name: 'Game', params: {}}">Game</router-link>
    <router-link :to="{ name: 'GameClient', params: {}}">Game Client</router-link>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style>
</style>
