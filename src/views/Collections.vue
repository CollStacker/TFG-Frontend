<template>
  <div class="collectionsContainer" :key="refreshComponent"> 
    <SideBar class="sidebar"></SideBar>
    <div class="collectionsContent">
      <NavBar class="customNavBar"></NavBar>
      <div v-if="isLoading" class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <div v-else>
        <div class ="collectionsMainContent" v-if="showCollectionView == true">
          <div v-if="collectionNum == 1" class="numCollsText" style="display: flex; align-items: center;">
            <div>
              <h1 class="collectionCounterNumber">{{ collectionNum }}</h1>
              <h1 class="collectionCounterText"> Collection</h1>
            </div>
            <div style="margin-left: auto;">
              <Button @click="createCollection" class="pi pi-plus customCreateCollectionButton bigger" label=" Create collection"/>
            </div>
          </div>
          <div v-else class="numCollsText" style="display: flex; align-items: center;">
            <div>
              <h1 class="collectionCounterNumber">{{ collectionNum }}</h1>
              <h1 class="collectionCounterText"> Collections</h1>
            </div>
            <div style="margin-left: auto;">
              <Button @click="createCollection" class="pi pi-plus customCreateCollectionButton bigger" label=" Create collection"/>
            </div>
          </div>
          <div class="collectionContainer" style="margin-top: 20px;">
            <div class="collectionContainterHeader" style="display: flex; justify-content: center;">
              <h1 class="uppercase bold big-text customHeaderText">My collections</h1>
            </div>
            <div style="display: flex; justify-content: center; margin-bottom: 20px;">
              <div class="separator"></div>
            </div>
            <div class="collectionListContainerBorder">
              <div class="collectionListContainer" v-if="collectionNum > 0">
                <lightgallery :settings="{ speed: 500, plugins: plugins }" :onInit="onInit" :onBeforeSlide="onBeforeSlide"
                  class="imageContainer" v-for="(collection,index) in collections" :key="index">
                    <a v-if="collection.frontPage !== ''" style="margin:2px" :data-src="collection.frontPage">
                      <img class="lightGalleryImg" alt="img1" :src="collection.frontPage" @click="openCollectionData(collection)"/>
                    </a>
                    <a v-else style="margin:2px" data-src="../assets/imgs/logo_without_background.png">
                      <img class="lightGalleryImg" alt="img2" src="../assets/imgs/logo_without_background.png" @click="openCollectionData(collection)" />
                    </a>
                </lightgallery>
              </div>
              <div v-else class="collectionListContainer" style="margin-bottom: 30px;">
                <span style="font-size: 20px;">You dont have any collection yet!!</span>
              </div>
            </div>
          </div>
          <!-- <Button @click="createProduct" class="pi pi-plus customCreateCollectionButton"> Create Product</Button> -->
        </div>
      </div>
      <div class ="collectionsMainContent" v-if="showCollectionView == false && showCollectionDataComponent == true" >
        <CollectionDataComponent :collection="collectionToOpen" @emitCloseCollectionComponent="emitCloseCollectionComponent()"/>
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
import Swal from 'sweetalert2'
import { ref, onMounted  } from "vue";
import { userAuthentication } from '@/store/userAuth.store';
import { type CollectionInterface } from '@/types/collection';
import CollectionDataComponent from '@/components/CollectionDataComponent.vue';

// GALERY
import Lightgallery from 'lightgallery/vue';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import { API_URI } from '@/types/env';

const plugins = [lgThumbnail, lgZoom];

const onInit = () => {

};

const onBeforeSlide = () => {
  
};

// SCRIPT

const authStore = userAuthentication();
const router = useRouter();
const refreshComponent = ref(0)

const showCollectionView = ref(true);
const showCollectionDataComponent = ref(false)

const collectionNum = ref(0);
const collections = ref();

const isLoading = ref<boolean>(true);

onMounted(async () => {
  await getCollectionData();
  isLoading.value = false;
})

const userData = authStore.getUserData();

const getCollectionData = async () => {
  if (!await authStore.checkToken()) {
    router.push('/');
  } else {
    const response = await fetch(API_URI + `/collections/user/${userData.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
    })
    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Failed to get collections",
        showConfirmButton: false,
        timer: 1700
      });
    } else {
      collections.value = await response.json();
      if(collectionNum.value) {
        collectionNum.value = collections.value.length;
      }
    }
  }
}

const collectionToOpen = ref<CollectionInterface>();
const openCollectionData = (collection: CollectionInterface) => {
  collectionToOpen.value = collection;
  showCollectionView.value = false;
  showCollectionDataComponent.value = true;
}

const createCollection = () => {
  router.push('/collectionForm')
}

// const createProduct = () => {
//   router.push('/productForm')
// }

const emitCloseCollectionComponent = () => {
  showCollectionView.value = true;
  showCollectionDataComponent.value = false;
  refreshComponent.value += 1;
}
</script>

<style scoped>
@import 'lightgallery/css/lightgallery.css';
@import 'lightgallery/css/lg-thumbnail.css';
@import 'lightgallery/css/lg-zoom.css';

.lightGalleryImg {
  width: 200px;
  height: 200px;
  max-width: 200px;
  max-height: 200px;
}
</style>

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
  padding: 48px;
}

.collectionContainer {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.uppercase {
  text-transform: uppercase;
}

.bold {
  font-weight: bold;
}

.big-text {
  font-size: 30px;
}

.separator {
  border-bottom: 2px solid #555555;
  width: 50%;
}

.collectionContainterHeader {
  padding: 10px;
}

.numCollsText h1{
  margin-top: 2px;
  margin-bottom: 2px;
}

.mb-10 {
  margin-bottom: 10px;
}

.collectionCounterText {
  font-size: 22px;
}

.collectionCounterNumber {
  font-size: 40px;
  font-weight: bold;
}

.collectionListContainerBorder {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
}

.collectionListContainer {
  text-align: center;
  margin: 10px; 
}

.imageContainer {
  display: inline-block;
}

.imageContainer img {
  transition: transform 0.3s ease;
}

.imageContainer img:hover {
  cursor: pointer;
  transform: scale(1.02);
  filter: brightness(90%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.collectionBody{
  width: 200px;
  height: 200px;
  background-color: #333;
  margin: 10px;
}

body {
  margin: 0;
}

button.p-button.p-component.customCreateCollectionButton {
  background-color: #333;
  border: 2px solid #333;
}

button.p-button.p-component.customCreateCollectionButton span {
  font-weight: bold;
  font-size: 16px;
  font-family: "Inter var", sans-serif;
  margin-left: 5px;
}

button.p-button.p-component.customCreateCollectionButton.bigger {
  width: 200px;
  height: 80px;
}

button.p-button.p-component.customCreateCollectionButton:hover {
  color: #333;
  border: 2px solid #333;
  background-color: white;
  transform: scale(1);
}

.customHeaderText {
  margin-top: 3px;
  margin-bottom: 3px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8); 
}

.spinner {
  width: 80px;
  height: 80px;
  border: 8px solid #f3f3f3; 
  border-top: 8px solid #333; 
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); 
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: rotate(180deg);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.4);
  }
  100% {
    transform: rotate(360deg);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
}

</style>