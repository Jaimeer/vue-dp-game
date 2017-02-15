<template>
  <div>
    <h1>Home</h1>
    <router-link :to="{ name: 'GameSpaceships', params: {}}">Spaceships</router-link>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style>
</style>
