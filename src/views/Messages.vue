<template>
  <Toast/>
  <div class="messagesContainer"> 
    <SideBar class="sidebar"></SideBar>
    <div class="messagesContent">
      <NavBar class="customNavBar"></NavBar>
      <div v-if="isLoading" class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <div v-else>
        <div class ="messagesMainContent">
          <div class="friendRequestContainer">
            <span class="uppercase bold big-text pl-7">Friend Requests</span>
            <div class="ccseparator"></div>
            <template v-if="friendRequestsRelevantData && friendRequestsRelevantData.length > 0">
              <div v-for="(friendRequest, index) in friendRequestsRelevantData" :key="index" class="friendRequestWrapper">
                <div class="friendRequestData">
                  <img v-if="friendRequest.profilePhoto === 'femaleYoung'" src="../assets/imgs/profilePhoto/female-young.jpg"/>
                  <img v-if="friendRequest.profilePhoto === 'maleYoung'" src="../assets/imgs/profilePhoto/male-young.jpg"/>
                  <img v-if="friendRequest.profilePhoto === 'maleAdult'" src="../assets/imgs/profilePhoto/male-adult.jpg"/>
                  <img v-if="friendRequest.profilePhoto === 'maleOld'" src="../assets/imgs/profilePhoto/male-old.jpg"/>
                  <img v-if="friendRequest.profilePhoto === 'femaleOld'" src="../assets/imgs/profilePhoto/female-old.jpg"/>
                  <img v-if="friendRequest.profilePhoto === 'femaleAdult'" src="../assets/imgs/profilePhoto/female-adult.jpg"/>
                  <span class="ml-12 largeText">{{ friendRequest.username }}</span>
                  <div class="button-container">
                    <Button class="customAcceptRequestButton pi pi-plus" label=" Accept" @click="acceptFriendRequest(friendRequest.id)"></Button>
                    <Button class="customRefuseRequestButton ml-12 pi pi-minus" label=" Decline" @click="refuseFriendRequest(friendRequest.id)"></Button>
                  </div>
                </div>
                <Divider />
              </div>
            </template>
            <template v-else>
              <div class="p-5">
                <span class="largeText">Sorry, you currently have no friend requests! </span>
              </div>
            </template>
          </div>
          <div class="friendListContainer">
            <span class="uppercase bold big-text pl-7">Friends List</span>
            <div class="ccseparator"></div>
            <template v-if="friendListRelevantData && friendListRelevantData.length > 0">
              <div v-for="(friend, index) in friendListRelevantData" :key="index" class="friendRequestWrapper">
                <div class="friendRequestData">
                  <img v-if="friend.profilePhoto === 'femaleYoung'" src="../assets/imgs/profilePhoto/female-young.jpg"/>
                  <img v-if="friend.profilePhoto === 'maleYoung'" src="../assets/imgs/profilePhoto/male-young.jpg"/>
                  <img v-if="friend.profilePhoto === 'maleAdult'" src="../assets/imgs/profilePhoto/male-adult.jpg"/>
                  <img v-if="friend.profilePhoto === 'maleOld'" src="../assets/imgs/profilePhoto/male-old.jpg"/>
                  <img v-if="friend.profilePhoto === 'femaleOld'" src="../assets/imgs/profilePhoto/female-old.jpg"/>
                  <img v-if="friend.profilePhoto === 'femaleAdult'" src="../assets/imgs/profilePhoto/female-adult.jpg"/>
                  <span class="ml-12 largeText">{{ friend.username }}</span>
                  <div class="button-container">
                    <Button class="customAcceptRequestButton spanDisplayNone pi pi-comment" @click="openChat(friend)"></Button>
                    <Button class="customRefuseRequestButton spanDisplayNone ml-12 pi pi-minus" @click="deleteFriend(friend.id)"></Button>
                  </div>
                </div>
                <Divider />
              </div>
            </template>
            <template v-else>
              <div class="p-5">
                <span class="largeText">Sorry, you currently have no friends! </span>
              </div>
            </template>
          </div>
          <!-- {{ friendList }}
          {{ friendListRelevantData }} -->
        </div>
      </div>
      <Footer class="customFooter"></Footer>
    </div>
    <Chat v-if="isChatOpen" class="chat-popup" :friend="friendChat" @closeChat="closeChat()"/>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/menu/SideBar.vue';
import NavBar from '@/components/menu/NavBar.vue';
import Footer from '@/components/menu/Footer.vue';
import {ref, onMounted} from 'vue'
import { useRouter } from 'vue-router';
import { userAuthentication } from '@/store/userAuth.store';
import { API_URI } from '@/types/env';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import { type UserInterface } from '@/types/user';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import Chat from '@/components/chat/Chat.vue';

const toast = useToast();
const authStore = userAuthentication();
const userId = ref(authStore.getUserData().id)

const router = useRouter();

const friendRequests = ref<{_id: string, userId: string, requestUserId: string}[]>();
const friendRequestsRelevantData = ref<UserInterface[]>([]);
const friendList = ref<string[]>();
const friendListRelevantData = ref<UserInterface[]>([]);
const isLoading = ref<boolean>(true);

onMounted(async () => {
  await getFriendRequest();
  await getFriendRequestRelevantData();
  await getFriendList();
  await getFriendListRelevantData();
  isLoading.value = false;
});

const resetInformation = async () => {
  friendRequests.value = [];
  friendList.value = [];
  friendListRelevantData.value = [];
  friendRequestsRelevantData.value = [];
  await getFriendRequest();
  await getFriendRequestRelevantData();
  await getFriendList();
  await getFriendListRelevantData();
}

const getFriendRequest = async () => {
  if (!await authStore.checkToken()) {
    router.push('/')
  } else {
    const response = await fetch(API_URI + `/friendRequest/${authStore.getUserData().id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
    })
    if(!response.ok) {
      const e = await response.json();
    } else {
      const foundedFriendRequests = await response.json();
      friendRequests.value = foundedFriendRequests;
    }
  }
}

const getFriendRequestRelevantData = async () => {
  if (!await authStore.checkToken()) {
    router.push('/')
  } else {
    if(friendRequests.value && friendRequests.value.length > 0) {
      for (const request of friendRequests.value) {
        const response = await fetch(API_URI + `/findUserById/${request.userId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.getToken()}`,
          },
        })
        if(!response.ok) {

        } else {
          friendRequestsRelevantData.value.push(await response.json())
        }
      }
    }
  }
}

const acceptFriendRequest = async (requesterId: string) => {
  if (!await authStore.checkToken()) {
    router.push('/')
  } else {
    const acceptRequestBody = {
      userId: authStore.getUserData().id,
      requestUserId:requesterId,
    }
    const response = await fetch(API_URI + `/acceptRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
      body: JSON.stringify(acceptRequestBody)
    })
    if(!response.ok) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Failed accepting friend request.', life: 3000 });
    } else {
      toast.add({ severity: 'success', summary: 'Succes message', detail: 'New friend added to list.', life: 3000 });
      await resetInformation();
    }
  }
}

const refuseFriendRequest = async (requesterId: string) => {
  if (!await authStore.checkToken()) {
    router.push('/')
  } else {
    const refuseRequestBody = {
      userId: authStore.getUserData().id,
      requestUserId:requesterId,
    }
    const response = await fetch(API_URI + `/refuseRequest`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
      body: JSON.stringify(refuseRequestBody)
    });
    if(!response.ok) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Failed refusing friend request.', life: 3000 });
    } else {
      toast.add({ severity: 'info', summary: 'Succes message', detail: 'Friend request refused.', life: 3000 });
      await resetInformation();
    }
  }
}

const getFriendList = async () => {
  if (!await authStore.checkToken()) {
    router.push('/')
  } else {
    const response = await fetch(API_URI + `/getFriends/${authStore.getUserData().id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
    })
    if(!response.ok) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Failed finding friends.', life: 3000 });
    } else {
      friendList.value = await response.json();
    }
  }
}

const getFriendListRelevantData = async () => {
  if (!await authStore.checkToken()) {
    router.push('/')
  } else {
    if(friendList.value && friendList.value.length > 0) {
      for (const friendId of friendList.value) {
        const response = await fetch(API_URI + `/findUserById/${friendId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.getToken()}`,
          },
        })
        if(!response.ok) {

        } else {
          friendListRelevantData.value.push(await response.json())
        }
      }
    }
  }
}

const deleteFriend = async (friendId: string) => {
  if (!await authStore.checkToken()) {
    router.push('/')
  } else {
    const deleteFriendRequestBody = {
      userId: authStore.getUserData().id,
      friendId: friendId,
    }
    const response =  await fetch(API_URI + `/deleteFriend`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
      body: JSON.stringify(deleteFriendRequestBody),
    });
    if (!response.ok) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Failed deleting friend.', life: 3000 });
    } else {
      toast.add({ severity: 'info', summary: 'Succes message', detail: 'Friend deleted.', life: 3000 });
      await resetInformation();
    }
  }
}

const isChatOpen = ref(false);
const friendChat = ref<UserInterface>();
const openChat = (friend: UserInterface) => {
  isChatOpen.value = true;
  friendChat.value = friend;
};

const closeChat = () => {
  isChatOpen.value = false;
}

</script>

<style>
.messagesContainer {
  display: flex;
  min-height: 100vh;
}

.messagesContent {
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

.messagesMainContent {
  margin: 69px 0 50px;
  background-color: #f3f2f2;
  min-height: calc(100vh - 69px - 50px);
  padding: 48px;
}

.friendRequestContainer {
  background-color: #ffffff;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.friendListContainer {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

body {
  margin: 0;
}

.uppercase {
  text-transform: uppercase;
}

.bold {
  font-weight: bold;
}

.big-text {
  font-size: 30px;
}

.ccseparator {
  border-bottom: 0.1px solid #555555;
  width: 100%;
  margin-bottom: 18px;
}

.friendRequestWrapper {
  margin-bottom: 16px;
}

.friendRequestData {
  display: flex;
  align-items: center;
  padding: 6px;
}


.friendRequestData img {
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

.p-5 {
  padding: 5px;
}

.button-container {
  display: flex;
  gap: 12px;
  margin-left: auto; /* Asegura que los botones se alineen a la derecha */
}

button.p-button.p-component.customAcceptRequestButton {
  background-color: #333;
  border: 2px solid #333;
  border-radius: 10px;
  height: 40px;
}

button.p-button.p-component.customAcceptRequestButton:hover {
  color: #333;
  border: 2px solid #333;
  background-color: white;
  transform: scale(1);
}

button.p-button.p-component.customRefuseRequestButton {
  background-color: #FF4B2B;
  border: 2px solid #FF4B2B;
  border-radius: 10px;
  height: 40px;
}

button.p-button.p-component.customRefuseRequestButton:hover {
  color: #FF4B2B;
  border: 2px solid #FF4B2B;
  background-color: white;
  transform: scale(1);
}
button.p-button.p-component.customAcceptRequestButton span,
button.p-button.p-component.customRefuseRequestButton span {
  font-weight: bold;
  font-size: 16px;
  font-family: "Inter var", sans-serif;
  margin-left: 5px;
}

button.p-button.p-component.customAcceptRequestButton.spanDisplayNone span,
button.p-button.p-component.customRefuseRequestButton.spanDisplayNone span {
  display: none;
}

.pl-7 {
  padding-left: 7px;
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

.messagesContainer {
  display: flex;
}

.messagesContent {
  flex: 1;
}

.chat-popup {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 500px;
  height: 600px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

</style>