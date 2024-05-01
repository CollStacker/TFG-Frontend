<template>
  <div class="productFormContainer"> 
    <SideBar class="sidebar"></SideBar>
    <div class="productFormContent">
      <NavBar class="customNavBar"></NavBar>
      <div class="productFormMainContent"> 
        <div class="productsFormContainer">
          <Toast/>
          <div class="container" :class="{ 'right-panel-active': productForm }">
            <!-- product form -->
            <div class="form-container sign-up-container">
              <form @submit.prevent="createProduct">
                <template id="createProductFormStep1" v-if="productFormStep === 0">
                  <div class="productFormHeader">
                    <h1 class="uppercase bold big-text">Create a product</h1>
                    <div class="separator mb-15"></div>
                  </div>
                  <div class="productForm mb-8">
                    <div class="title-wrapper">
                      <span class="uppercase bold fs-b"><label class="red-text">* </label>Product Name</span>
                      <InputText class="biggerInputText" v-model="productData.name" placeholder="Product Name"/>
                    </div>
                  </div>
                  <div class="productForm mb-8">
                    <div class="title-wrapper">
                      <span class="uppercase bold fs-b">Description</span>
                      <Textarea class="biggerInputText" v-model="productData.description" placeholder="Product Name" autoResize maxlength="350"/>
                    </div>
                  </div>
                  <small>{{`${productData.description.length}/350`}}</small>
                  <i class="customNextStepButton pi pi-arrow-right" @click="handleNextStep"></i>
                </template>
                <template id="createProductFormStep2" v-if="productFormStep === 1">
                  <div class="productFormHeader">
                    <h1 class="uppercase bold big-text">Insert an image</h1>
                    <div class="separator mb-15"></div>
                  </div>
                  <div class="productForm mb-8">
                    <div class="title-wrapper">
                      <FileUpload name="collectionImg[]" customUpload auto :multiple="false" accept="image/*" :maxFileSize="1000000"
                        @select="upload($event)">
                        <template #empty>
                          <p v-if="productData.image.length === 0">Drag and drop files to here to upload.</p>
                        </template>
                        <template #content>
                          <!--MOSTRAR LA IMAGEN CARGADA EN fileUpload CON SU PESO Y UN BOTÓN PARA ELIMINARLA-->
                          <div v-if="productData.image.length > 0" style="display:flex; align-items: center;">
                            <div style="display:flex;">
                              <img v-if="productData.image" :src="productData.image" alt="fileUpload" style="width: 64px" />
                              <p v-if="productData.image" style="margin-left: 10px;">{{ imgSize }} KB</p>
                          </div>
                          <i class="pi pi-times" @click="deleteUploadImg" style="margin-left: 10px;"></i>
                        </div>
                        </template>
                      </FileUpload>
                    </div>
                  </div>
                  <div class="button-container">
                    <i class="customPreviousStepButton pi pi-arrow-left" @click="previousProductStep"></i>
                    <i class="customNextStepButton pi pi-arrow-right" @click="handleNextStep"></i>
                    <!-- <Button class="createCollectionButton pi pi-check" label="Create" type="submit"></Button> -->
                  </div>
                </template>
                <template id="createProductFormStep3" v-if="productFormStep === 2">
                  <div class="productFormHeader">
                    <h1 class="uppercase bold big-text">Insert custom fields</h1>
                    <div class="separator mb-15"></div>
                  </div>
                  <div class="productForm mb-8">
                    <div class="title-wrapper">
                      <span class="uppercase bold fs-b">Custom fields</span>
                      <Dialog v-model:visible="customFieldsDialogVisible" modal header="CUSTOM FIELDS LIST" class="customFieldsDialog" :style="{ width: '60rem', height: '28rem' }">
                        <div class="separator mb-15"></div>
                        <DataTable :value="customFields" paginator :rows="4" tableStyle="min-width: 50rem">
                          <Column field="key" header="Name"></Column>
                          <Column field="value" header="Value"></Column>
                        </DataTable>
                      </Dialog>
                      <InputText class="biggerInputText" v-model="customField.key" placeholder="Field name"/>
                      <InputText class="biggerInputText" v-model="customField.value" placeholder="Field value"/>
                      <Button class="addCustomFieldButton pi pi-plus" label="ADD CUSTOM FIELD" @click="addCustomField"/>
                      <Button class="addCustomFieldButton pi pi-eye" label="CHECK CUSTOM FIELDS" @click="customFieldsDialogVisible = true" :disabled="customFields.length === 0"/>
                    </div>
                  </div>
                  <div class="button-container">
                    <i class="customPreviousStepButton pi pi-arrow-left" @click="previousProductStep"></i>
                    <!-- create collection button-->
                    <Button class="createCollectionButton pi pi-check" label="Create" type="submit"></Button>
                  </div>
                </template>
              </form>
            </div>
            <div class="overlay-container">
              <div class="overlay">
                <!-- Left panel-->
                <div class="overlay-panel overlay-left">
                  <h1>Hey there, Treasure Hunter!</h1>
                  <p>Let's create a collection together, give it a name and if you wish, insert an image</p>
                </div>
              </div>
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
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row';                   
import Toast from 'primevue/toast';
import Button from 'primevue/button';
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
const productForm = ref(true);

const productData = ref({
  name: '',
  description: '',
  image: '',
  publicationDate: new Date(),
  collectionId: ''// SACAR LA ID DE UN PROP DE LA COLECCION EN LA QUE SE CREE
})

interface CustomFieldsInterface {
  key: string,
  value: string,
  type: string,
  productId: string
}

const customField = ref({
  key: '',
  value: '',
  type: '',
  productId: ''
})

const customFields = ref<CustomFieldsInterface[]>([]);

const imgSize = ref(0.0);
const upload = (e: any) => {
  const file = e.files[0];
  if(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { 
      if (typeof reader.result === 'string') {
        const base64String = reader.result;
        
        const base64Data = base64String.split(',')[1];
        const base64Size = base64Data.length; 
        const estimatedFileSize = (base64Size * 3) / 4;
        // meter en imgSize el valor en kbs de estimatedFileSize
        imgSize.value = estimatedFileSize/1024;

        productData.value.image = base64String;
        console.log(productData.value)
      };
    }
  }
}

const deleteUploadImg = () => {
  productData.value.image = '';
}

const createProduct = () => {

}

const onAdvancedUpload = () => {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const productFormStep = ref(0);
const handleNextStep = () => {
  if(productFormStep.value === 0) {
    if (productData.value.name == '' || productData.value.name.length == 0) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Name is a mandatory field.', life: 3000 });
    } else {
      productFormStep.value += 1;
    }
  } else {
    productFormStep.value += 1;
  }
}

const previousProductStep = () => {
  productFormStep.value -= 1;
}

const addCustomField = () => {
  const tmpCustomFieldData = {
    key: customField.value.key,
    value: customField.value.value,
    type: customField.value.type,
    productId: customField.value.productId
  } 
  if (tmpCustomFieldData.key == '' || tmpCustomFieldData.value == '') {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'All fields must be filled.', life: 3000 });
    return;
  } else {
    customFields.value.push(tmpCustomFieldData);
    clearCustomFieldData();
  }
}

const clearCustomFieldData = () => {
  customField.value.key = '';
  customField.value.value = '';
}

const customFieldsDialogVisible = ref(false);
</script>

<style>
.productFormContainer {
  display: flex;
  min-height: 100vh;
}

.productFormContent {
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

.productFormMainContent {
  margin: 69px 0 50px;
  background-color: #f3f2f2;
  min-height: calc(100vh - 69px - 50px);
  padding: 70px;
}

body {
  margin: 0;
}

.productsFormContainer {
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
  width: 18rem;
  max-width: 18rem;
  height: 2.5rem;
  margin: 0px;
  border: 1px solid #c7c7c7;
  background-color: transparent;
}

.mt-10 {
  margin-top: 10px;
}

.p-inputtext.p-component.addCategoryInputText {
  width: calc(640px - 87.61px);
  max-width: 40rem;
  margin: 0px;
  border: 1px solid #c7c7c7;
  background-color: transparent;
}

.p-inputtext.p-component.showCategoryInputText {
  width: calc(640px - 52px - 52px);
  max-width: 40rem;
  margin: 0px;
  border: 1px solid #c7c7c7;
  background-color: transparent;
}

.p-inputtext.p-component.showCategoryInputText:disabled {
  background-color: #f2f2f2;
}

.mb-8 {
  margin-bottom: 8px;
}

.mb-15 {
  margin-bottom: 15px;
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

.productForm {
  display: flex;
  justify-content: center; 
}

.title-wrapper {
  display: grid;
  grid-template-columns: 1fr; 
  grid-gap: 5px; 
}

.productForm span {
  text-align: left; 
}

.p-button.p-component,
.p-button.p-component.p-fileupload-choose {
  background-color: #333;
  border: 2px solid #333;
  color: white;
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

.mt-13 {
  margin-top: 13px;
}

.p-inputswitch.p-highlight .p-inputswitch-slider {
  background: #333;
}

.p-button-label {
  font-family:"Inter var", sans-serif;
}

.p-button.p-component.customEditCategoryButton span {
  display: none;
}

.p-button.p-component.createCollectionButton {
  margin-left: 206px;
}

.fs-b {
  font-size: 18px;
}

.p-button.p-component.addCustomFieldButton span, 
.p-button.p-component.createCollectionButton span {
  margin-left: 10px;
}

.p-column-header-content .p-column-title {
  font-weight: bold;
  font-size: 18px;
}

.p-dialog.p-component.p-ripple-disabled.customFieldsDialog .p-dialog-header .p-dialog-title{ 
  font-weight: bold;
  font-size: 30px;
}

.p-dialog.p-component.p-ripple-disabled.customFieldsDialog .p-dialog-header {
  padding: 12px;
  padding-bottom: 4px;
}
</style>

<style scoped>

form {
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}
.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 
      0 10px 10px rgba(0,0,0,0.22);
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1100px; 
  min-height: 650px;
  position: absolute; 
  top: 51%;
  left: 50%;
  transform: translate(-50%, -50%); 
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}


.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container{
  transform: translateX(-100%);
}

.overlay {
  /* background: #FF416C;
  background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);
  background: linear-gradient(to right, #FF4B2B, #FF416C); */
  background: #333;
  background: -webkit-linear-gradient(to right, #333, #767676);
  background: linear-gradient(to right, #131313, #666666);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #FFFFFF;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #DDDDDD;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

.customNextStepButton {
  color: #FFFFFF;
  margin-top: 10px;
  background-color: #333;
  /* border: 1px solid #FF4B2B; */
  border: 1px solid #333;
  padding: 8px;
  border-radius: 20px;
  margin-left: 206px;
}

.customNextStepButton:hover {
  /* color: #FF4B2B; */
  color: #333;
  background-color: #FFFFFF;
  /* border: 1px solid #FF4B2B; */
  border: 1px solid #333;
  transform: scale(1.07);
}

.customPreviousStepButton {
  color: #FFFFFF;
  margin-top: 10px;
  /* background-color: #FF4B2B; */
  background-color: #333;
  /* border: 1px solid #FF4B2B; */
  border: 1px solid #333;
  padding: 8px;
  border-radius: 20px;
  margin-right: 0;
}

.customPreviousStepButton:hover {
  /* color: #FF4B2B; */
  color: #333;
  background-color: #FFFFFF;
  /* border: 1px solid #FF4B2B; */
  border: 1px solid #333;
  transform: scale(1.07);
}

</style>