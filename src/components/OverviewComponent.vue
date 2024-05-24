<template>
  <Toast/>
  <Dialog v-model:visible="readComments" class="commentsDialog" header=" ">
    <CommentDialogComponent :currentProduct="currentProduct"/>
  </Dialog>
  <div v-if="isLoading" class="loading-spinner">
    <div class="spinner"></div>
  </div>
  <div v-else>
    <div v-if="!showProductInformation">
      <template v-if="last20Products && last20Products.length > 0">
        <div class="overviewMainContainer">
          <div class="overviewComponentContainer" v-for="(product,index) in last20Products">
            <div class="userDataContainer" v-if="last20ProductsUser[index]">
              <img v-if="last20ProductsUser[index].profilePhoto === 'femaleYoung'" src="../assets/imgs/profilePhoto/female-young.jpg"/>
              <img v-if="last20ProductsUser[index].profilePhoto === 'maleYoung'" src="../assets/imgs/profilePhoto/male-young.jpg"/>
              <img v-if="last20ProductsUser[index].profilePhoto === 'maleAdult'" src="../assets/imgs/profilePhoto/male-adult.jpg"/>
              <img v-if="last20ProductsUser[index].profilePhoto === 'maleOld'" src="../assets/imgs/profilePhoto/male-old.jpg"/>
              <img v-if="last20ProductsUser[index].profilePhoto === 'femaleOld'" src="../assets/imgs/profilePhoto/female-old.jpg"/>
              <img v-if="last20ProductsUser[index].profilePhoto === 'femaleAdult'" src="../assets/imgs/profilePhoto/female-adult.jpg"/>
              <span class="ml-12 largeText userNameSpan" @click="redirectToUserPage(last20ProductsUser[index])">{{ last20ProductsUser[index].username }}</span>
            </div>
            <span class="publicationDate" v-if="product.publicationDate">{{ timeSince(product.publicationDate.toString()) }}</span>
            <div class="productDataContainer">
              <img v-if="product.image" :src="product.image" class="productImg" @click="openProductDataComponent(product)">
              <img v-else src="../assets/imgs/logo_without_background.png" class="productImg" @click="openProductDataComponent(product)">
              <h1 class="bold productTitle" @click="openProductDataComponent(product)">{{ product.name }}</h1>
            </div>
            {{ productLikesVec[index] }} Likes
            <Divider></Divider>
            <div class="footerOverviewMainContainer">
              <Button class="footerButton pi pi-thumbs-up" :label="t(' Like')" @click="giveALike(product._id,index)"></Button>
              <Button class="footerButton pi pi-comment" style="margin:0px 10px 0px 10px" @click="openProductComments(product)" :label="t(' Comment')"></Button>
              <Button class="footerButton pi pi-link" :label="t(' Share')"></Button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="overviewComponentContainer">
          <span class="ml-12 largeText">{{t('There are no recent posts, refresh the page')}}</span>
        </div>
      </template>
    </div>
    <div v-else>
      <ProductDataComponent :selectedProduct="selectedProduct" :readOnly="readOnly" @emitCloseProductComponent="closeProductComponent()"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import Toast from 'primevue/toast';
import { userAuthentication } from '@/store/userAuth.store';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import { type HomeViewProductDataInterface } from '@/types/product';
import { type UserInterface } from '@/types/user';
import { API_URI } from '@/types/env';
import ProductDataComponent from './ProductDataComponent.vue';
import { type WholeProductDataInterface } from '@/types/product';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import CommentDialogComponent from './Dialog/CommentDialogComponent.vue';

import { useI18n } from 'vue-i18n'
const {t} = useI18n();

const toast = useToast();
const authStore = userAuthentication();
const router = useRouter();

onMounted(async () => {
  await findProducts();
  await findProductsOwners();
  await reverseArrays();
  isLoading.value = false;
});

const last20Products = ref<HomeViewProductDataInterface[]>();
const last20ProductsUser = ref<UserInterface[]>([]);
const isLoading = ref<boolean>(true);

const readOnly = ref<boolean>(true);
const showProductInformation = ref(false);
const selectedProduct = ref<WholeProductDataInterface>();

const readComments = ref<boolean>(false);

const productLikesVec =  ref<number[]>([])

const findProducts = async() => {
  if(!await authStore.checkToken()) {
    router.push('/');
  } else {
    const response = await fetch(API_URI + '/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
    }) 
    if (!response.ok) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: t('Failed finding products.'), life: 3000 });
    } else {
      last20Products.value = await response.json();
    }
  }
}

const findProductsOwners = async() => {
  if(!await authStore.checkToken()) {
    router.push('/');
  } else {
    if(last20Products.value && last20Products.value.length > 0) {
      for(const product of last20Products.value) {
        const response = await fetch(API_URI + `/findUserById/${product.ownerId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.getToken()}`,
          },
        });
        if (!response.ok) {
          toast.add({ severity: 'error', summary: 'Error Message', detail: t('Failed finding owners.'), life: 3000 });
        } else {
          last20ProductsUser.value.push(await response.json());
          productLikesVec.value.push(0);
        }
      }
    }
  }
}

function timeSince(date: string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const differenceInMilliseconds = now.getTime() - pastDate.getTime();

  // Convertir la diferencia a horas y días
  const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
}

const reverseArrays = async () => {
  if(last20Products.value) {
    last20Products.value = last20Products.value.reverse();
  }
  if(last20ProductsUser.value) {
    last20ProductsUser.value = last20ProductsUser.value.reverse();
  }
}

const redirectToUserPage = (currentUser: UserInterface) => {
  authStore.setFoundedUserData({
    id: currentUser.id,
    username: currentUser.username,
    name: currentUser.name,
    surnames: currentUser.surnames,
    email: currentUser.email,
    biography: currentUser.biography,
    profilePhoto: currentUser.profilePhoto
  })
  router.push('/userFounded');
}

const openProductDataComponent = async (product: HomeViewProductDataInterface) => {
  const productToOpen: WholeProductDataInterface = {
    _id: product._id,
    name: product.name,
    description: product.description,
    image: product.image, 
    publicationDate: product.publicationDate, 
    collectionId: '',
  }
  if (!authStore.checkToken()) {
    router.push('/');
  } {
    const response = await fetch(API_URI + `/product-fields/${product._id}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
    });
    if(!response.ok) {

    } else {
      productToOpen.customFields = await response.json();
    }
  }
  selectedProduct.value = productToOpen;
  showProductInformation.value = true;
}

const closeProductComponent = () => {
  showProductInformation.value =  false;
}

const currentProduct = ref<HomeViewProductDataInterface>();
const openProductComments = (product : HomeViewProductDataInterface) => {
  currentProduct.value = product;
  readComments.value = true;
}

const giveALike = async (productId: string, productIndex: number) => {
  if(!authStore.checkToken()) {
    router.push('/');
  } else {
    const requestBody = {
      productId: productId,
      userId: authStore.getUserData().id,
    }
    const response = await fetch(API_URI + `/productLike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
      body: JSON.stringify(requestBody)
    })
    if(!response.ok) {

    } else {
      productLikesVec.value[productIndex] += 1;
    }
  }
}

</script>

<style scoped>
.overviewComponentContainer{
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center; 
  margin-bottom: 20px; 
  max-width: 420px;
  max-height: 1000px;
  padding: 10px 20px 10px 20px;
}

.overviewMainContainer {
  display: flex;
  flex-direction: column;
  align-items: center; 
}

.userDataContainer {
  display: flex;
  align-items: center;

  margin-right: auto;
}

.userDataContainer img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
}

.ml-12 {
  margin-left: 12px;
}

.largeText {
  font-size: 25px;
}

.productImg {
  width: 400px;
  height: 400px;
  max-width: 400px;
  max-height: 400px;
  border: 1px solid #9f9f9f;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.productImg:hover {
  transform: scale(1.01);
  cursor: pointer; 
}

.productTitle {
    font-size: 25px;
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
    word-break: break-word;
    white-space: normal;
    text-align: center;
    display: inline-block;
    position: relative;
    cursor: pointer; 
}

.productTitle::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: black; 
  bottom: -2px;
  left: 0;
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: bottom right;
}

.productTitle:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.productDataContainer {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.publicationDate {
  margin-left: auto; 
}

.userNameSpan {
  position: relative;
  cursor: pointer; 
}

.userNameSpan::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: black;
  bottom: -2px;
  left: 0;
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: bottom right;
}

.userNameSpan:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
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

<style>

.p-dialog.p-component.p-ripple-disabled.commentsDialog {
  width: 800px;
  max-height: 600px;
  margin-left: 220px;
}

button.p-button.p-component,
button.p-button.p-component.footerButton {
  background-color: #333;
  border: 2px solid #333;
  border-radius: 50px;
  height: 50px;
}

button.p-button.p-component span,
button.p-button.p-component.footerButton span {
  font-family: "Inter var", sans-serif;
  font-weight: bold;
}

button.p-button.p-component:hover,
button.p-button.p-component.footerButton:hover {
  color: #333;
  border: 2px solid #333;
  background-color: white;
  transform: scale(1);
}
</style>