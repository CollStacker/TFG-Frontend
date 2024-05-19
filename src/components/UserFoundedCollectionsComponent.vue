<template>
  <div class="foundedUserCollectionsContainer" :key="refreshComponent" v-if="props.foundedUser"> 
    <div class="foundedUsercollectionsContent">
      <div class ="foundedUsercollectionsMainContent" v-if="showCollectionView == true">
        <div class="foundedUsercollectionContainer" style="margin-top: 20px;">
          <div class="foundedUsercollectionContainterHeader" style="display: flex; justify-content: center;">
            <h1 class="uppercase bold big-text foundedUsercustomHeaderText">{{ props.foundedUser.username }} collections</h1>
          </div>
          <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            <div class="separator"></div>
          </div>
          <div class="foundedUsercollectionListContainerBorder">
            <div class="foundedUsercollectionListContainer" v-if="collectionNum > 0">
              <lightgallery :settings="{ speed: 500, plugins: plugins }" 
                class="imageContainer" v-for="(collection,index) in collections" :key="index">
                  <a v-if="collection.frontPage !== ''" style="margin:2px" :data-src="collection.frontPage">
                    <img class="foundedUserlightGalleryImg" alt="img1" :src="collection.frontPage" @click="openCollectionData(collection)"/>
                  </a>
                  <a v-else style="margin:2px" data-src="../assets/imgs/logo_without_background.png">
                    <img class="foundedUserlightGalleryImg" alt="img2" src="../assets/imgs/logo_without_background.png" @click="openCollectionData(collection)" />
                  </a>
              </lightgallery>
            </div>
            <div v-else class="foundedUsercollectionListContainer" style="margin-bottom: 30px;">
              <span style="font-size: 20px;">{{ props.foundedUser.username }} doesn't have any collection yet!!</span>
            </div>
          </div>
        </div>
      </div>
      <div class ="foundedUsercollectionsMainContent" v-if="showCollectionView == false && showCollectionDataComponent == true" >
        <CollectionDataComponent :collection="collectionToOpen" @emitCloseCollectionComponent="emitCloseCollectionComponent()"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'
import { ref, onMounted  } from "vue";
import { userAuthentication } from '@/store/userAuth.store';
import { type CollectionInterface } from '@/types/collection';
import CollectionDataComponent from '@/components/CollectionDataComponent.vue';

const props = defineProps({
  foundedUser: {
    type: Object
  }
})

// GALERY
import Lightgallery from 'lightgallery/vue';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import { API_URI } from '@/types/env';

const plugins = [lgThumbnail, lgZoom];

// SCRIPT

const authStore = userAuthentication();
const router = useRouter();
const refreshComponent = ref(0)

const showCollectionView = ref(true);
const showCollectionDataComponent = ref(false)

const collectionNum = ref(0);
const collections = ref();

onMounted(async () => {
  await getCollectionData();
})

const getCollectionData = async () => {
  if(props.foundedUser) {
    if (!await authStore.checkToken()) {
      router.push('/');
    } else {
      const response = await fetch(API_URI + `/collections/user/${props.foundedUser.id}`, {
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

.foundedUserlightGalleryImg {
  width: 200px;
  height: 200px;
  max-width: 200px;
  max-height: 200px;
}
</style>

<style>
.foundedUserCollectionsContainer {
  display: flex;
}

.foundedUsercollectionsContent {
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

.foundedUsercollectionsMainContent {
  margin: 0px;
  background-color: #f3f2f2;
  margin-bottom: 55px;
  padding-left: 48px;
  padding-right: 48px;
}

.foundedUsercollectionContainer {
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

.foundedUsercollectionContainterHeader {
  padding: 10px;
}

.foundedUsernumCollsText h1{
  margin-top: 2px;
  margin-bottom: 2px;
}

.mb-10 {
  margin-bottom: 10px;
}

.foundedUsercollectionCounterText {
  font-size: 22px;
}

.foundedUsercollectionCounterNumber {
  font-size: 40px;
  font-weight: bold;
}

.foundedUsercollectionListContainerBorder {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
}

.foundedUsercollectionListContainer {
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

.foundedUsercustomHeaderText {
  margin-top: 3px;
  margin-bottom: 3px;
}

</style>