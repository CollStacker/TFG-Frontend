<template>
  <div class="collectionContainer"> 
    <SideBar></SideBar>
    <h1>Hello from collections</h1>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/menu/SideBar.vue';

</script>

<style>
.collectionContainer {
  display: flex;
}

body {
  margin: 0;
}


</style>