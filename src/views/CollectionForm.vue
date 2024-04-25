<template>
  <div class="collectionsFormContainer"> 
    <SideBar class="sidebar"></SideBar>
    <div class="collectionsFormContent">
      <NavBar class="customNavBar"></NavBar>
      <div class ="collectionsFormMainContent">
        <div class="collectionFormContainer">
          <div class="collectionform mb-8">
            <h1 class="uppercase bold big-text">Create your collection</h1>
            <div class="separator mb-8"></div>
          </div>
          <div>
            <div class="collectionform mb-8">
              <span class="uppercase bold"><label class="red-text">* </label>Title</span>
              <InputText class="biggerInputText" v-model="collectionFormData.title" placeholder="Title"/>
            </div>
            <div class="collectionform mb-8">
              <span class="uppercase bold">description</span>
              <Textarea class="biggerTextArea" v-model="collectionFormData.description" placeholder="Description" :autoResize="true"/>
            </div>
            <div class="collectionform mb-8">
              <Toast />
              <span class="uppercase bold">Collection image</span>
              <FileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload()" :multiple="true" accept="image/*" :maxFileSize="1000000">
                <template #empty>
                  <p>Drag and drop files to here to upload.</p>
                </template>
              </FileUpload>
            </div>
            <div class="collectionform mb-8">
              
            </div>
          </div>
        </div>
      </div>
      <Footer class="customFooter"></Footer>
    </div>
  </div>
</template>
<script lang="ts" setup >
import SideBar from '@/components/menu/SideBar.vue';
import NavBar from '@/components/menu/NavBar.vue';
import Footer from '@/components/menu/Footer.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import { ref } from 'vue';
import { userAuthentication } from '@/store/userAuth.store';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";


const toast = useToast();
const router = useRouter();
const authStore = userAuthentication();

const userData = authStore.getUserData();

const collectionFormData = ref({
  title: '',
  description: '',
  frontPage: '',
  ownerId: userData.id,
})

const collectionCategoriesData = ref([])
const categoryData = ref ({
  name: '',
  collectionId: '',
})

const onAdvancedUpload = () => {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

</script>

<style>
.collectionsFormContainer {
  display: flex;
  min-height: 100vh;
}

.collectionsFormContent {
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

.collectionsFormMainContent {
  margin: 69px 0 50px;
  background-color: #f3f2f2;
  min-height: calc(100vh - 69px - 50px);
  padding: 70px;
}

body {
  margin: 0;
}

.collectionFormContainer {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  background-color: white;
}

textarea.p-inputtextarea.p-inputtext.p-component.biggerTextArea,
.p-inputtext.p-component.biggerInputText {
  width: 80rem;
  max-width: 40rem;
  margin: 0px;
  border: 1px solid #c7c7c7;
  background-color: transparent;
}

.mb-8 {
  margin-bottom: 8px;
}

.red-text {
  color: rgb(246, 71, 71);
}

.uppercase{
  text-transform: uppercase;
}

.bold {
  font-weight: bold;
}

.collectionform {
  display: flex;
  flex-direction: column;
}

.p-button.p-component,
.p-button.p-component.p-fileupload-choose {
  background-color: #333;
  border: 2px solid #333;
}

.p-button.p-component:hover,
.p-button.p-component.p-fileupload-choose:hover {
  color: #333;
  border: 2px solid #333;
  background-color: white;
  transform: scale(1);
}

.separator {
  border-bottom: 0.1px solid #555555;
  width: 100%;
}

.big-text {
  font-size: 30px;
}

</style>