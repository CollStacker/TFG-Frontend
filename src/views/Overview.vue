<template>
  <div class="overViewContainer"> 
    <SideBar class="sidebar"></SideBar>
    <div class="content">
      <NavBar class="customNavBar"></NavBar>
      <div class ="mainContent">

      </div>
      <h1>Hello from main page</h1>
    
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/menu/SideBar.vue';
import NavBar from '@/components/menu/NavBar.vue';
</script>

<style>
.overViewContainer {
  display: flex;
}

.content {
  flex-grow: 1; 
  position: relative;
}

.customNavBar {
  height: 69px; /* Altura de la NavBar */
  width: 100%;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 768px) {
  .customNavBar {
    height: 69px;
  }
  .mainContent {
  margin-top: 69px;
}
}

.mainContent {
  margin-top: 69px;
}

body {
  margin: 0;
}


</style>