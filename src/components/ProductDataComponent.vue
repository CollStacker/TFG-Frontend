<template>
  <Button class="editCollectionButton pi pi-arrow-left" @click="emitCloseProductComponent()"/>
  <div class="productContainer" v-if="props.selectedProduct" style="margin-top: 20px; margin-bottom: 20px;">
    <div class="productDataContainer">
      <lightgallery :settings="{ speed: 500, plugins: plugins }" @init="onInit" @beforeSlide="onBeforeSlide" class="imageContainer">
        <a v-if="props.selectedProduct.image !== ''" :href="props.selectedProduct.image">
          <img alt="Collection image" :src="props.selectedProduct.image" class="lightGalleryImg"/>
        </a>
        <a v-else href="../assets/imgs/logo.png">
          <img alt="No image" src="../assets/imgs/logo_without_background.png" class="lightGalleryImg"/>
        </a>
      </lightgallery>
      <h1 class="bold mb-2" >{{ props.selectedProduct.name }}</h1>
      <div class="collectionDescription mb-2">
        <span>{{ props.selectedProduct.description }}</span>
      </div>
    </div>
  </div>
  <!-- {{ props.selectedProduct }} -->
</template>

<script setup lang="ts">
import {ref} from 'vue'
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import { userAuthentication } from '@/store/userAuth.store';
import Button from 'primevue/button';

const toast = useToast();
const router = useRouter();
const authStore = userAuthentication();
const props = defineProps({
  selectedProduct: {
    type: Object
  }
})
const emits = defineEmits(["emitCloseProductComponent"])

const emitCloseProductComponent = () => {
  emits("emitCloseProductComponent");
}


// GALERY
import Lightgallery from 'lightgallery/vue';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

const plugins = [lgThumbnail, lgZoom];
let lightGallery: any = null;

const gallerySettings = {
  speed: 500,
  plugins: [lgZoom, lgThumbnail],
};

const onInit = (detail:any) => {
  lightGallery = detail.instance;
};

const onBeforeSlide = () => {

};

</script>

<style scoped>
.productContainer {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.productDataContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.collectionInformation .collectionDescription {
  max-width: 950px;
  word-wrap: break-word;
}
</style>