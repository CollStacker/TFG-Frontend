<template>
  <div class="userProfileContainer" :key="key"> 
    <SideBar class="sidebar"></SideBar>
    <div class="userProfileContent">
      <NavBar class="customNavBar" @refreshNav="refreshNav()"></NavBar>
      <div class ="userProfileMainContent">
        <UserProfileComponent></UserProfileComponent>
      </div>
      <Footer class="customFooter"></Footer>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/menu/SideBar.vue';
import NavBar from '@/components/menu/NavBar.vue';
import Footer from '@/components/menu/Footer.vue';
import UserProfileComponent from '@/components/UserProfileComponent.vue';
import {ref} from 'vue'

const key = ref<number>(0);
const refreshNav = () => {
  key.value = key.value + 1;
}
</script>

<style>
.userProfileContainer {
  display: flex;
  min-height: 100vh;
}

.userProfileContent {
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

.userProfileMainContent {
  margin: 69px 0 50px;
  background-color: #f3f2f2;
  min-height: calc(100vh - 69px - 50px);
}

body {
  margin: 0;
}


</style>