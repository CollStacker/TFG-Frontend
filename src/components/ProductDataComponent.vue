<template>
  <Button class="editCollectionButton pi pi-arrow-left" @click="emitCloseProductComponent()"/>
  {{ props.selectedProduct }}
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

</script>

<style scoped>
</style>