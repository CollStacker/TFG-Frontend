<template>
  <div class="collectionsContainer"> 
    <SideBar class="sidebar"></SideBar>
    <div class="collectionsContent">
      <NavBar class="customNavBar"></NavBar>
      <div class ="collectionsMainContent">
        <Button @click="createCollection" class="pi pi-plus customCreateCollectionButton"> Create collection</Button>
        <Button @click="createProduct" class="pi pi-plus customCreateCollectionButton"> Create Product</Button>

      </div>
      <Footer class="customFooter"></Footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/menu/SideBar.vue';
import NavBar from '@/components/menu/NavBar.vue';
import Footer from '@/components/menu/Footer.vue';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const router = useRouter();

const createCollection = () => {
  router.push('/collectionForm')
}

const createProduct = () => {
  router.push('/productForm')
}
</script>

<style>
.collectionsContainer {
  display: flex;
  min-height: 100vh;
}

.collectionsContent {
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

.collectionsMainContent {
  margin: 69px 0 50px;
  background-color: #f3f2f2;
  min-height: calc(100vh - 69px - 50px);
}

body {
  margin: 0;
}

button.p-button.p-component.customCreateCollectionButton {
  background-color: #333;
  border: 2px solid #333;
}

button.p-button.p-component.customCreateCollectionButton:hover {
  color: #333;
  border: 2px solid #333;
  background-color: white;
  transform: scale(1);
}

</style>