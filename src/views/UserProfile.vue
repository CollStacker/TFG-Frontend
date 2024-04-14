<template>
  <div class="userProfileContainer"> 
    <SideBar></SideBar>
    <h1>Hello from user Profile</h1>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/menu/SideBar.vue';

</script>

<style>
.userProfileContainer {
  display: flex;
}

body {
  margin: 0;
}


</style>