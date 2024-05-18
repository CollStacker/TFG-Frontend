<template>
  <div class="userProfileComponentContainer">
    <div class="userProfileComponentColumn">
      <div class="userProfileComponentCard"> 
        <img class="cardImgTop" src="../assets/imgs/sidebar/sidebar.jpg" alt="Card image cap">
        <div class="cardBody littleProfile textCenter">
          <div class="proImg">
            <img v-if="userData.profilePhoto === 'maleYoung'"  src="../assets/imgs/profilePhoto/male-young.jpg"/>
            <img v-if="userData.profilePhoto === 'maleAdult'"  src="../assets/imgs/profilePhoto/male-adult.jpg"/>
            <img v-if="userData.profilePhoto === 'maleOld'"  src="../assets/imgs/profilePhoto/male-old.jpg"/>
            <img v-if="userData.profilePhoto === 'femaleOld'"  src="../assets/imgs/profilePhoto/female-old.jpg"/>
            <img v-if="userData.profilePhoto === 'femaleAdult'"  src="../assets/imgs/profilePhoto/female-adult.jpg"/>
            <img v-if="userData.profilePhoto === 'femaleYoung'"  src="../assets/imgs/profilePhoto/female-young.jpg"/>
          </div>
          <span class="usernameText" >{{userData.username}}</span>
          <div class="userDataContainer">
            <div class="userDataText">
              <div class="formGroup">
                <span class="formGroupInputText">Email</span>
                <InputText class="customUserProfileInputText" v-model="userData.email" :disabled="inputTextEditable" />
              </div>
              <div class="formGroup">
                <span class="formGroupInputText">Name</span>
                <InputText class="customUserProfileInputText" v-model="userData.name" :disabled="inputTextEditable" />  
              </div>
              <div class="formGroup">
                <span class="formGroupInputText">Surnames</span>
                <InputText class="customUserProfileInputText" v-model="userData.surnames" :disabled="inputTextEditable" />
              </div>
            </div>
            <div class="biografyFormGroup" v-if="userData.biography">
              <div class="formGroup">
                <span class="formGroupInputText">About me</span>
                <Textarea class="customUserProfileTextArea" v-model="userData.biography" :disabled="inputTextEditable" autoResize />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { ref } from "vue";
import { userAuthentication } from '@/store/userAuth.store';

const authStore = userAuthentication();

const inputTextEditable = ref(true)
const userData = ref(authStore.getFoundedUserData());
</script>

<style>
.userProfileComponentContainer {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  padding: 3rem;
  display: flex;
  justify-content: center; 
  align-items: center;
}

.userProfileComponentCard {
  border-radius: 4px;
  background-color: #ffffff;
  margin-bottom: 30px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
}

.cardImgTop {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.cardBody {
  padding: 1.25rem;
}


.littleProfile .proImg img {
  width: 230px;
  margin-top: -160px;
  height: 230px;
  margin-bottom: 10px;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
}

.textCenter {
  text-align: center;
}

.userProfileComponentColumn {
  flex: 0 0 auto;
  width: 66.666667%;
}

@media (max-width: 991.98px) {
  .padding {
    margin-left: 0;
  }
}

.usernameText {
  font-family: 'Pacifico', cursive;
  font-size: 34px;
  color: #2c2c2c; 
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); 
  margin-bottom: 40px;
}

.userDataContainer {
  display: block;
  margin-top: 0em;
  unicode-bidi: isolate; 
  margin-top: 30px;
}

.userDataText {
  display: flex;
  flex-wrap: wrap;
}

.formGroup {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 4px;
}

.formGroupInputText {
  align-self: flex-start;
  text-transform: uppercase;
  /* font-family: Roboto, Helvetica Neue, Arial, sans-serif; */
  font-family: sans-serif;
  color: #9a9a9a;
  font-size: 12px;
  margin-bottom: 5px;
  font-weight: bold;
  margin-left: 2px;
}

input.p-inputtext.p-component.customUserProfileInputText {
  margin: 0px;
  height: 50%;
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #b9b9b9;
  font-family: Roboto, Helvetica Neue, Arial, sans-serif;
}

.biografyFormGroup {
  margin-top: 10px;
}

textarea.p-inputtextarea.p-inputtext.customUserProfileTextArea {
  margin: 0px;
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #b9b9b9;
  font-family: Roboto, Helvetica Neue, Arial, sans-serif;
  background-color: #EEEEEE;
}
</style>