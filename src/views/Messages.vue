<template>
  <div class="messagesContainer"> 
    <SideBar class="sidebar"></SideBar>
    <div class="messagesContent">
      <NavBar class="customNavBar"></NavBar>
      <div class ="messagesMainContent">
        <h1 class="test">Hello from messages page</h1>
      </div>
      <Footer class="customFooter"></Footer>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/menu/SideBar.vue';
import NavBar from '@/components/menu/NavBar.vue';
import Footer from '@/components/menu/Footer.vue';
</script>

<style>
.messagesContainer {
  display: flex;
  min-height: 100vh;
}

.messagesContent {
  flex-grow: 1; 
  position: relative;
}

.customNavBar {
  height: 69px; 
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
  .customFooter {
    height: 200px;
  }
}

.customFooter {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
}

.messagesMainContent {
  margin-top: 69px;
  margin-bottom: 50px;
}

body {
  margin: 0;
}


</style>