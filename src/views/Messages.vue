<template>
  <div class="messagesContainer"> 
    <SideBar></SideBar>
    <h1>Hello from messages page</h1>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/menu/SideBar.vue';

</script>

<style>
.messagesContainer {
  display: flex;
}

body {
  margin: 0;
}


</style>