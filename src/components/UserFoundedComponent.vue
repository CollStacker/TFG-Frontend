<template>
  <Toast/>
  <div>
    <div class="foundedUserProfileComponentContainer">
      <div class="foundedUserProfileComponentColumn">
        <div v-if="!checkAlreadyFriend()">
          <div class="userFoundedButtonsContainer" v-if="foundedUserData.id !== currentUserData.id">
            <Button class="customAddFriendButton pi pi-plus" :label="t(' Add friend')" @click="sendFriendRequest()"></Button>
          </div>
        </div>
        <div class="userProfileComponentCard"> 
          <img class="cardImgTop" src="../assets/imgs/sidebar/sidebar.jpg" alt="Card image cap">
          <div class="cardBody littleProfile textCenter">
            <div class="proImg ">
              <img v-if="foundedUserData.profilePhoto === 'maleYoung'"  src="../assets/imgs/profilePhoto/male-young.jpg"/>
              <img v-if="foundedUserData.profilePhoto === 'maleAdult'"  src="../assets/imgs/profilePhoto/male-adult.jpg"/>
              <img v-if="foundedUserData.profilePhoto === 'maleOld'"  src="../assets/imgs/profilePhoto/male-old.jpg"/>
              <img v-if="foundedUserData.profilePhoto === 'femaleOld'"  src="../assets/imgs/profilePhoto/female-old.jpg"/>
              <img v-if="foundedUserData.profilePhoto === 'femaleAdult'"  src="../assets/imgs/profilePhoto/female-adult.jpg"/>
              <img v-if="foundedUserData.profilePhoto === 'femaleYoung'"  src="../assets/imgs/profilePhoto/female-young.jpg"/>
              <img v-if="foundedUserData.profilePhoto === 'defaultProfilePhoto'" src="../assets/imgs/profilePhoto/defaultProfilePhoto.png" />
            </div>
            <div>
              <span class="usernameText" >{{foundedUserData.username}}</span><br>
              <span class="formGroupInputTextb">@{{ foundedUserData.name }} {{ foundedUserData.surnames }}</span>
            </div>
            <div class="foundedUserDataContainer">
              <div class="foundedUserDataText">
                <!-- <div class="formGroup">
                  <span class="formGroupInputTextb">Email</span>
                  <span>{{ foundedUserData.email }}</span>
                </div> -->
                <!-- <div class="formGroup">
                  <span class="formGroupInputTextb">Name</span>
                </div>
                <div class="formGroup">
                  <span class="formGroupInputTextb">Surnames</span>
                  <span>{{ foundedUserData.surnames }}</span>
                </div> -->
              </div>
              <div class="biografyFormGroup" v-if="foundedUserData.biography">
                <div class="formGroup textCenter">
                  <span class="formGroupInputTextb biography">{{t('About me')}}</span>
                  <span>{{ foundedUserData.biography }}</span>
                  <!-- <Textarea class="customUserProfileTextArea" v-model="foundedUserData.biography" :disabled="inputTextEditable" autoResize /> -->
                </div>
              </div>
            </div>
  
          </div>
        </div>
      </div>
    </div>
    <UserFoundedCollectionsComponent :foundedUser="foundedUserData"/>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { onMounted, ref } from "vue";
import { userAuthentication } from '@/store/userAuth.store';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import { API_URI } from '@/types/env';
import UserFoundedCollectionsComponent from './UserFoundedCollectionsComponent.vue'

import { useI18n } from 'vue-i18n'
const {t} = useI18n();

const authStore = userAuthentication();
const router = useRouter();
const toast = useToast();

const inputTextEditable = ref(true)
const foundedUserData = ref(authStore.getFoundedUserData());
const currentUserData = ref(authStore.getUserData());
const friends = ref<string[]>(authStore.getFriends());

const checkAlreadyFriend = ():boolean => {
  return friends.value.includes(foundedUserData.value.id);
}

const sendFriendRequest = async () => {
  if(!await authStore.checkToken()) {
    router.push('/');
  } else {
    const friendRequestBody = {
      userId: currentUserData.value.id,
      requestUserId: foundedUserData.value.id
    }
    const friendshipRequest = await fetch(API_URI + `/friendRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
      body: JSON.stringify(friendRequestBody)
    })
    if(!friendshipRequest.ok) {
      const e = await friendshipRequest.json();
      toast.add({ severity: 'error', summary: 'Error Message', detail: e.error.message, life: 3000 });
    } else {
      toast.add({ severity: 'success', summary: 'Collection created', detail: t('Friend request has been sent')+'.', life: 3000 });
    }
  }
}

</script>

<style>
.foundedUserProfileComponentContainer {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  padding: 3rem;
  padding-bottom: 0;
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

.foundedUserProfileComponentColumn {
  flex: 0 0 auto;
  width: 100%;
}

@media (max-width: 991.98px) {
  .padding {
    margin-left: 0;
  }
}

.usernameText {
  font-family:Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 34px;
  font-weight: bold;
  color: #2c2c2c; 
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); 
  margin-bottom: 40px;
}

.foundedUserDataContainer {
  display: block;
  margin-top: 0em;
  unicode-bidi: isolate; 
  /* margin-top: 30px; */
}

.foundedUserDataText {
  display: flex;
  flex-wrap: wrap;
}

.formGroup {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 4px;
}

.formGroupInputTextb {
  /* align-self: flex-start; */
  text-transform: uppercase;
  /* font-family: Roboto, Helvetica Neue, Arial, sans-serif; */
  font-family: sans-serif;
  color: #9a9a9a;
  font-size: 12px;
  margin-bottom: 5px;
  font-weight: bold;
  margin-left: 2px;
}

.biography {
  color: #333;
  font-size: 16px;
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

.userFoundedButtonsContainer {
  margin-bottom: 10px;
  display: flex;
  justify-content: end;
}

button.p-button.p-component.customAddFriendButton span {
  font-weight: bold;
  font-size: 16px;
  font-family: "Inter var", sans-serif;
  margin-left: 5px;
}

button.p-button.p-component.customAddFriendButton {
  background-color: #333;
  border: 2px solid #333;
  border-radius: 50px;
  height: 50px;
}

button.p-button.p-component.customAddFriendButton:hover {
  color: #333;
  border: 2px solid #333;
  background-color: white;
  transform: scale(1);
}
</style>