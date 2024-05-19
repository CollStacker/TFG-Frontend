<template>
  <div class="overviewComponentContainer">
    <!-- {{ last20Products?.length }} -->
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

const toast = useToast();
const authStore = userAuthentication();
const router = useRouter();

onMounted(async () => {
  await findProducts();
});

const last20Products = ref<HomeViewProductDataInterface[]>();
const last20ProductsUser = ref<UserInterface[]>([]);

const findProducts = async () => {
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


</script>

<style scoped>
.overviewComponentContainer{
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}
</style>