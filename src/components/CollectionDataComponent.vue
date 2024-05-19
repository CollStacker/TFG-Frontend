<template>
  <Toast/>
  <template v-if="showProducts === true">
    <Dialog v-model:visible="openCreateProductDialog" modal header=" " :style="{ width: '75rem', height: '48rem' , overflow: 'hidden' }">
      <div style="overflow: hidden;">
        <CreateProductForm :collectionId="props.collection ? props.collection._id : ''" @closeProductDialog="closeProductDialog()"/>
      </div>
    </Dialog>
    <Dialog v-model:visible="openAddCategoriesDialog" modal header="Add a category" :style="{ width: '30rem' }">
      <div style="padding-left: 14px;">
        <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 15px;">
          <label class="uppercase bold">Category name</label>
          <InputText id="username" class="editCollectioncustomInput" autocomplete="off" v-model="newCategoryName"/>
        </div>
        <div style="display: flex; justify-content: end;">
          <Button type="button" label="Cancel" severity="secondary" @click="openAddCategoriesDialog = false"></Button>
          <Button type="button" label="Save" @click="addCategorie()" style="margin-left: 5px;"></Button>
        </div>
      </div>
    </Dialog>
    <Dialog v-model:visible="editCollection" modal header="Edit collection" :style="{ width: '30rem' }">
      <div style="padding-left: 16px;">
        <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 15px;">
          <label for="username" class="uppercase bold">Title</label>
          <InputText id="username" class="editCollectioncustomInput" autocomplete="off" v-model="newTitle"/>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 6px;">
          <label for="username" class="uppercase bold">Description</label>
          <Textarea id="username" class="editCollectioncustomInput" autocomplete="off" v-model="newDescription" auto-resize :maxlength="350"/>
          <div style="display: flex; justify-content: center; align-items: center;">
            {{ newDescription.length + "/350" }}
          </div>
        </div>
        <div>
          <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 6px;"></div>
          <label for="username" class="uppercase bold">Image</label>
          <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" customUpload auto chooseLabel="Browse" @select="upload($event)"/>
        </div>
      </div>
      <div style="display: flex; justify-content: end;">
        <Button type="button" label="Cancel" @click="editCollection = false"></Button>
        <Button type="button" label="Save" @click="saveNewCollectionData()" style="margin-left: 5px;"></Button>
      </div>
    </Dialog>
    <div style="display: flex;">
      <Button class="editCollectionButton pi pi-arrow-left" @click="emitCloseCollectionComponent()"/>
      <div style="margin-left: auto;">
        <Button class="addCategoriesButton pi pi-plus" label=" ADD PRODUCT" @click="openCreateProductDialog = true"></Button>
        <Button class="addCategoriesButton pi pi-plus" label=" ADD CATEGORY" @click="openAddCategoriesDialog = true" style="margin-left: 10px;"></Button>
        <Button class="editCollectionButton pi pi-pencil" @click="editCollection = true" style="margin-left: 10px;"/>
      </div>
    </div>
    <div class="collectionContainer" v-if="props.collection" style="margin-top: 20px; margin-bottom: 20px;">
      <div class="collectionDataContainer">
        <lightgallery :settings="{ speed: 500, plugins: plugins }" @init="onInit" @beforeSlide="onBeforeSlide" class="imageContainer">
          <a v-if="props.collection.frontPage !== ''" :href="props.collection.frontPage">
            <img alt="Collection image" :src="props.collection.frontPage" class="lightGalleryImg"/>
          </a>
          <a v-else href="../assets/imgs/logo.png">
            <img alt="No image" src="../assets/imgs/logo_without_background.png" class="lightGalleryImg"/>
          </a>
        </lightgallery>
        <div class="collectionInformation" style="margin-left: 5px;">
          <h1 class="bold mb-2" >{{ props.collection.title }}</h1>
          <div class="collectionDescription mb-2">
            <span>{{ props.collection.description }}</span>
          </div>
          <div class="badgeContainer">
            <div v-if="collectionCategories && collectionCategories.length > 0" v-for="(category, index) in collectionCategories"> 
              <Badge :value="category.name" severity="contrast"></Badge>
            </div>
          </div>
        </div>
      </div> 
    </div>
    <div class="collectionContainer" >
      <div class="collectionContainterHeader" style="display: flex; justify-content: center;">
        <h1 class="uppercase bold big-text customHeaderText">Products</h1>
      </div>
      <div style="display: flex; justify-content: center; margin-bottom: 20px;">
        <div class="separator"></div>
      </div> 
      <div v-if="!collectionProducts" class="noProductsContainer">
        <span>There are no products in this collection!!</span>
      </div>
      <div v-else class="collectionListContainerBorder"> 
        <div class="collectionListContainer">
          <lightgallery :settings="gallerySettings" :onInit="onInit" :onBeforeSlide="onBeforeSlide" class="imageContainer">
            <a v-for="(product, index) in collectionProducts" :data-lg-index="index" data-sub-html=".lg-sub-html" :key="index" class="productLink">
              <div class="productOverlay" @click="openProductComponent(product)">
                <h3>{{ product.name }}</h3>
                <p>{{ product.description }}</p>
                <div v-if="product.customFields">
                  <div v-for="customField in product.customFields" style="display: flex; justify-content: center;">
                    <p class="bold customFieldKey">{{ customField.key}}:</p>
                    <p> {{ customField.value }}</p>
                  </div>
                </div>
              </div>
              <img class="lightGalleryImg" v-if="product.image" :alt="'img' + (index + 1)" :src="product.image"/>
              <img class="lightGalleryImg" v-else :alt="'img' + (index + 1)" src="../assets/imgs/logo_without_background.png"/>
            </a>
          </lightgallery>
        </div>
      </div>
    </div>
  </template>
  <template v-if="showProducts === false && showProductData === true"> 
    <ProductDataComponent :selectedProduct="selectedProduct" @emitCloseProductComponent="closeProductComponent()"/>
  </template>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { API_URI } from '@/types/env';
import Swal from 'sweetalert2'
import { userAuthentication } from '@/store/userAuth.store';
import Button from 'primevue/button';
import { type CollectionInterface } from '@/types/collection';
import { type CategoryInterface } from '@/types/category'
import Dialog from 'primevue/dialog';
import Badge from 'primevue/badge';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import CreateProductForm from '@/components/CreateProductForm.vue';
import { type WholeProductDataInterface } from '@/types/product';
import ProductDataComponent from './ProductDataComponent.vue'

const toast = useToast();
const router = useRouter();
const authStore = userAuthentication();
const props = defineProps({
  collection: {
    type: Object
  }
})


const emits = defineEmits(["emitCloseCollectionComponent"]);

const emitCloseCollectionComponent = () => {
  emits("emitCloseCollectionComponent");
}

onMounted(async () => {
  await getCollectionCategories();
  await getCollectionProducts();
});

const showProducts = ref<boolean>(true);
const showProductData = ref<boolean>(false);
const selectedProduct = ref<WholeProductDataInterface>();

const openProductComponent = (product: WholeProductDataInterface) => {
  selectedProduct.value = product;
  showProducts.value = false;
  showProductData.value = true;
}

const closeProductComponent = () => {
  showProducts.value = true;
  showProductData.value = false;
}

const collectionCategories = ref<CategoryInterface[]>();
const getCollectionCategories = async () => {
  if(!await authStore.checkToken()) {
    router.push('/');
  } else {
    const categories = await fetch(API_URI + `/categories/bycollection/${props.collection ? props.collection._id : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
    })
    if (!categories.ok) {
      Swal.fire({
        icon: "error",
        title: "Couldn't get categories",
        showConfirmButton: false,
      });
    } else {
      collectionCategories.value = await categories.json();
    }
  }
}

const collectionProducts = ref<WholeProductDataInterface[]>();
const getCollectionProducts = async () => {
  if (!await authStore.checkToken()) {
    router.push('/');
  } else {
    const response = await fetch(API_URI + `/products/byCollectionId/${props.collection ? props.collection._id : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
    })
    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Couldn't get products",
        showConfirmButton: false,
      });
    } else {
      collectionProducts.value = await response.json();
      getProductCustomFields();
    }
  }
}

const getProductCustomFields = async () => {
  if(collectionProducts.value) {
    if(collectionProducts.value.length > 0) {
      let index = 0;
      for(const product of collectionProducts.value) {
        const response = await fetch(API_URI + `/product-fields/${product._id}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.getToken()}`,
          },
        })
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: `Couldn't get products fields of product ${product.name}`,
            showConfirmButton: false,
          });
        } else {
          const productFields = await response.json();
          if (productFields) {
            collectionProducts.value[index].customFields = productFields;
          }
        }
        index += 1;
      }
    }
  }
}

const editCollection = ref(false);
const newTitle = ref("");
const newDescription = ref("");
const newFrontPage = ref("");

const saveNewCollectionData = async () => {
  if(props.collection) {
    const newCollectionData:CollectionInterface  = {
      _id: props.collection._id,
      title: props.collection.title,
      description: props.collection.description,
      tag: props.collection.tag,
      frontPage: props.collection.frontPage,
      ownerId: props.collection.ownerId
    }
    if(newTitle.value !== '') {
      newCollectionData.title = newTitle.value;
    }
    if(newDescription.value !== '') {
      newCollectionData.description = newDescription.value;
    }
    if(newFrontPage.value !== '') {
      newCollectionData.frontPage = newFrontPage.value;
    }

    if(! await authStore.checkToken()) {
      router.push('/');
    } else {
      const response = await fetch(API_URI + `/collections/${props.collection._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.getToken()}`,
        },
        body: JSON.stringify(newCollectionData),
      })

      if(!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Failed to update collection",
          showConfirmButton: false,
        });
      } else {
        newTitle.value !== '' ? props.collection.title = newTitle.value : props.collection.title = props.collection.title;
        newDescription.value !== '' ? props.collection.description = newDescription.value : props.collection.description = props.collection.description;
        newFrontPage.value !== '' ? props.collection.frontPage = newFrontPage.value  : props.collection.frontPage = props.collection.frontPage;
        editCollection.value = false;
        newTitle.value = '';
        newDescription.value = '';
        newFrontPage.value = '';
      }
    } 

  }
}

const upload = (e: any) => {
  const file = e.files[0];
  if(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { 
      if (typeof reader.result === 'string') {
        newFrontPage.value = reader.result;
      };
    }
  }
}

const openAddCategoriesDialog = ref(false);
const newCategory = ref<CategoryInterface>({
  name: '',
  description: '',
  parentId: '',
  collectionId: props.collection ? props.collection._id : '',
})
const newCategoryName = ref("");

const addCategorie = async () => {
  if(newCategoryName.value !== "") {
    newCategory.value.name = newCategoryName.value;
    if(!await authStore.checkToken()) {
      router.push('/');
    } else {
      const response = await fetch(API_URI + `/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.getToken()}`,
        },
        body: JSON.stringify(newCategory.value),
      })
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Something were wrong in the insertion of the category.",
          showConfirmButton: false,
        });
      } else {
        newCategoryName.value = "";
        await getCollectionCategories();
        openAddCategoriesDialog.value = false;
      }
    }
  } else {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Name is a mandatory field.', life: 3000 });
  }
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

//
//collectionProducts.value ? collectionProducts.value[currentIndex].name : ''
//collectionProducts.value ? collectionProducts.value[currentIndex].description : ''
// const onAfterSlide = (index: number) => {
//   const currentSubHtml = document.getElementsByClassName(`lg-sub-html-${index}`);
//   console.log(currentSubHtml)
//   if (currentSubHtml) {
//     if (collectionProducts.value) {
//       const currentProduct = collectionProducts.value[index];
//       currentSubHtml.innerHTML = `
//         <h3>${currentProduct.name}</h3>
//         <p>${currentProduct.description}</p>
//       `;
//     }
//   }
// };

// PRODUCT

const openCreateProductDialog = ref(false)

const closeProductDialog = async () => {
  openCreateProductDialog.value = false;
  // Update collection products
  await getCollectionProducts();
}

</script>

<style scoped>

.lightGalleryImg {
  width: 200px;
  height: 200px;
  max-width: 200px;
  max-height: 200px;
}

.collectionDataContainer {
  display: flex;
  /* flex-wrap: wrap; */
  justify-content: center;
  padding: 10px;
}

.customHeaderText {
  margin-top: 3px;
  margin-bottom: 3px;
}

.separator {
  border-bottom: 2px solid #555555;
  width: 50%;
}

.collectionInformation .collectionDescription {
  max-width: 950px;
  /* break workd*/
  word-wrap: break-word;
}

.mb-2 {
  margin-bottom: 2px;
}

.collectionContainer {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.uppercase{
  text-transform: uppercase;
}

.bold {
  font-weight: bold;
}

.badgeContainer {
  display: flex;
}

.badgeContainer > div {
  margin-right: 8px;
}

.noProductsContainer {
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  height: 100%; /* Opcional, ajusta la altura según sea necesario */
}

.noProductsContainer span {
  font-size: 20px;
  margin-bottom: 30px;
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

.productLink {
  position: relative;
  display: inline-block;
}

.productOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden; 
}

.productLink:hover .productOverlay {
  opacity: 1;
  /* transform: scale(1.5) */
}

.productOverlay h3,
.productOverlay p {
  margin: 0;
  font-size: 18px;
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
  color: #333;
}

.productOverlay p {
  font-size: 14px;
}

.productOverlay h3 {
  font-weight: bold;
}

.productOverlay .customFieldKey {
  overflow: visible; 
}

</style>

<style>

button.p-button.p-component.addCategoriesButton,
button.p-button.p-component.editCollectionButton {
  background-color: #333;
  border: 2px solid #333;
  border-radius: 50px;
  height: 50px;
}

button.p-button.p-component.addCategoriesButton span {
  font-family: "Inter var", sans-serif;
  text-transform: uppercase;
  font-weight: bold;
}

button.p-button.p-component.editCollectionButton span{
  display: none;
}
button.p-button.p-component.addCategoriesButton:hover,
button.p-button.p-component.editCollectionButton:hover {
  color: #333;
  border: 2px solid #333;
  background-color: white;
  transform: scale(1);
}

.p-button.p-component {
  background-color: #333;
  border: 2px solid #333;
  color: white;
}

.p-button.p-component:hover {
  color: #333;
  border: 2px solid #333;
  background-color: white;
  transform: scale(1);
}

.p-inputtext.p-component.editCollectioncustomInput {
  background-color: white;
  border: 0.2px solid #bbbbbb;
  margin: 0;
  width: 400px;
}


</style>