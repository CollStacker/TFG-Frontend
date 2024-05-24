<template>
  <Toast/>
  <Dialog v-model:visible="editProduct" modal :header="t('Edit Product')" :style="{ width: '30rem' }">
    <div style="padding-left: 16px;">
      <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 15px;">
        <label  class="uppercase bold">{{t('Product Name')}}</label>
        <InputText class="editCollectioncustomInput" autocomplete="off" v-model="newProductName"/>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 6px;">
        <label for="username" class="uppercase bold">{{('Description')}}</label>
        <Textarea id="username" class="editCollectioncustomInput" autocomplete="off" v-model="newDescription" auto-resize :maxlength="350"/>
        <div style="display: flex; justify-content: center; align-items: center;">
          {{ newDescription.length + "/350" }}
        </div>
      </div>
      <div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 6px;"></div>
        <label for="username" class="uppercase bold">{{('Image')}}</label>
        <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" customUpload auto chooseLabel="Browse" @select="upload($event)"/>
      </div>
    </div>
    <div style="display: flex; justify-content: end;">
      <Button type="button" :label="t('Cancel')" @click="editProduct = false"></Button>
      <Button type="button" :label="t('Save')" @click="saveNewProductData()" style="margin-left: 5px;"></Button>
    </div>
  </Dialog>
  <div style="display: flex;">
    <Button class="editCollectionButton pi pi-arrow-left" @click="emitCloseProductComponent()"/>
      <div style="margin-left: auto;" v-if="!props.readOnly">
        <Button class="editCollectionButton pi pi-pencil" @click="editProduct = true" style="margin-left: 10px;"/>
      </div>
    </div>
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
      <div v-if="props.selectedProduct.customFields">
        <h1>{{t('Product Features')}}:</h1>
        <div class="centered">
          <div class="customFieldscontainer">
            <div class="row" v-for="field in props.selectedProduct.customFields" :key="field.key">
              <span class="fieldSize bold mr-5">{{ field.key + ": "}}</span>
              <span class="fieldSize">{{ field.value }}</span>
            </div>
          </div>
        </div>
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
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';

import { useI18n } from 'vue-i18n'
const {t} = useI18n();

const toast = useToast();
const router = useRouter();
const authStore = userAuthentication();
const props = defineProps({
  selectedProduct: {
    type: Object
  },
  readOnly: {
    type: Boolean
  }
})
const emits = defineEmits(["emitCloseProductComponent"])

const editProduct = ref<boolean>(false);

const emitCloseProductComponent = () => {
  emits("emitCloseProductComponent");
}

const newProductName = ref<string>("");
const newDescription = ref<string>("");
const newImage = ref<string>("");

const saveNewProductData = async () => {
  if (props.selectedProduct) {
    const newProductData = {
      _id: props.selectedProduct._id,
      name: newProductName.value !== "" ? newProductName.value : props.selectedProduct.name,
      description: newDescription.value !== "" ? newDescription.value : props.selectedProduct.description,
      image: newImage.value !== "" ? newImage.value : props.selectedProduct.image,
      publicationDate: props.selectedProduct.publicationDate,
      collectionId: props.selectedProduct.collectionId,
    } 
    if(! await authStore.checkToken()) {
      router.push('/');
    } else {
      const response = await fetch(API_URI + `/products/${props.selectedProduct ? props.selectedProduct._id : ''}`,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.getToken()}`,
        },
        body: JSON.stringify(newProductData),
      })
      if(!response.ok) {
        toast.add({ severity: 'error', summary: 'Error Message', detail: t('Failed editing product')+'.', life: 3000 });
      } else {
        toast.add({ severity: 'success', summary: 'Product edited', detail: t('Product')+ ': ' + newProductData.name + t('has been edited')+'.', life: 3000 });
        updateProduct();
        clearData();
        editProduct.value = false;
      }
    } 
  }

}

const updateProduct = () => {
  if(props.selectedProduct) {
    newProductName.value !== "" ? props.selectedProduct.name = newProductName.value : props.selectedProduct.name = props.selectedProduct.name;
    newDescription.value !== "" ? props.selectedProduct.description = newDescription.value : props.selectedProduct.description = props.selectedProduct.description;
    newImage.value !== "" ? props.selectedProduct.image = newImage.value : props.selectedProduct.image = props.selectedProduct.image;
  }
}

const clearData = () => {
  newDescription.value = "";
  newProductName.value = "";
  newImage.value = "";
}

const upload = (e: any) => {
  const file = e.files[0];
  if(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { 
      if (typeof reader.result === 'string') {
        newImage.value = reader.result;
      };
    }
  }
}

// GALERY
import Lightgallery from 'lightgallery/vue';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import { API_URI } from '@/types/env';

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

.collectionDescription {
  max-width: 950px;
  word-wrap: break-word;
}

.fieldSize {
  font-size: 20px;
  display: inline-block;
}

.centered {
  display: flex;
  align-items: center; 
  justify-content: center;
}
.customFieldscontainer {
  display: flex;
  flex-direction: column;
  /* align-items: center; 
  justify-content: center;  */
  padding: 10px;
}

.row {
  display: flex;
  text-align: left; 
}

.mr-5 {
  margin-right: 5px;
}

.lightGalleryImg {
  width: 200px;
  height: 200px;
  max-width: 200px;
  max-height: 200px;
}

</style>