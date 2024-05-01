<template>
  <!-- {{ props.collection }} -->
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
    <div style="display: flex; justify-content: end;" class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" @click="editCollection = false"></Button>
      <Button type="button" label="Save" @click="saveNewCollectionData()" style="margin-left: 5px;"></Button>
    </div>
  </Dialog>
  <div style="display: flex;">
    <div style="margin-left: auto;">
      <Button class="editCollectionButton pi pi-pencil" @click="editCollection = true"/>
    </div>
  </div>
  <div class="collectionContainer">
    <h1> KLK ESTA PASANDO AQUI</h1>  
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { API_URI } from '@/types/env';
import Swal from 'sweetalert2'
import { userAuthentication } from '@/store/userAuth.store';
import Button from 'primevue/button';
import { type CollectionInterface } from '@/types/collection';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = userAuthentication();
const props = defineProps({
  collection: {
    type: Object
  }
})

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

</script>

<style scoped>

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

</style>

<style>

button.p-button.p-component.editCollectionButton {
  background-color: #333;
  border: 2px solid #333;
  border-radius: 50px;
  height: 50px;
}

button.p-button.p-component.editCollectionButton span{
  display: none;
}

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