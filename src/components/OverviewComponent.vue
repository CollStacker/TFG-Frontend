<template>
  <Toast/>
  <template v-if="last20Products && last20Products.length > 0">
    <div class="overviewMainContainer">
      <div class="overviewComponentContainer" v-for="(product,index) in last20Products">
        <div class="userPublication">
          <img v-if="last20ProductsUser[index].profilePhoto === 'femaleYoung'" src="../assets/imgs/profilePhoto/female-young.jpg"/>
          <img v-if="last20ProductsUser[index].profilePhoto === 'maleYoung'" src="../assets/imgs/profilePhoto/male-young.jpg"/>
          <img v-if="last20ProductsUser[index].profilePhoto === 'maleAdult'" src="../assets/imgs/profilePhoto/male-adult.jpg"/>
          <img v-if="last20ProductsUser[index].profilePhoto === 'maleOld'" src="../assets/imgs/profilePhoto/male-old.jpg"/>
          <img v-if="last20ProductsUser[index].profilePhoto === 'femaleOld'" src="../assets/imgs/profilePhoto/female-old.jpg"/>
          <img v-if="last20ProductsUser[index].profilePhoto === 'femaleAdult'" src="../assets/imgs/profilePhoto/female-adult.jpg"/>
          <span class="ml-12 largeText">{{ last20ProductsUser[index].username }}</span>
          <span v-if="product.publicationDate">{{ timeSince(product.publicationDate.toString()) }}</span>
        </div>
        <div class="productDataContainer">
          <img v-if="product.image" :src="product.image" class="productImg">
          <img v-else src="../assets/imgs/logo_without_background.png" class="productImg">
          <h1 class="bold productTitle">{{ product.name }}</h1>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="overviewComponentContainer">
      <span class="ml-12 largeText">There are no recent posts, refresh the page</span>
    </div>
  </template>
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

const toast = useToast();
const authStore = userAuthentication();
const router = useRouter();

onMounted(async () => {
  await findProducts();
  await findProductsOwners();
});

const last20Products = ref<HomeViewProductDataInterface[]>();
const last20ProductsUser = ref<UserInterface[]>([]);

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
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Failed finding products.', life: 3000 });
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
          toast.add({ severity: 'error', summary: 'Error Message', detail: 'Failed finding owners.', life: 3000 });
        } else {
          last20ProductsUser.value.push(await response.json());
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

.userPublication {
  display: flex;
  align-items: center;
  padding: 6px;
}

.userPublication img {
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

.productTitle {
  font-size: 25px;
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
  word-break: break-word;
  white-space: normal;
}

.productDataContainer {
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>