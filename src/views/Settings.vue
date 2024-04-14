<template>
  <div class="settingsContainer"> 
    <SideBar></SideBar>
    <h1>Hello from settings page</h1>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/menu/SideBar.vue';

</script>

<style>
.settingsContainer {
  display: flex;
}

body {
  margin: 0;
}


</style>