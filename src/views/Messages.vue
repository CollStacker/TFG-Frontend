<template>
  <div class="messagesContainer"> 
    <SideBar class="sidebar"></SideBar>
    <div class="messagesContent">
      <NavBar class="customNavBar"></NavBar>
      <div class ="messagesMainContent">
        <h1 class="test">Hello from messages page</h1>
        {{ friendRequestsRelevantData.length }}
        {{friendRequestsRelevantData}}
      </div>
      <Footer class="customFooter"></Footer>
    </div>
    
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

const toast = useToast();
const authStore = userAuthentication();
const userId = ref(authStore.getUserData().id)

const router = useRouter();

const friendRequests = ref<{_id: string, userId: string, requestUserId: string}[]>();
const friendRequestsRelevantData = ref<UserInterface[]>([]);

onMounted(async () => {
  await getFriendRequest();
  await getFriendRequestRelevantData();
});

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
      console.log(e);
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
}

body {
  margin: 0;
}


</style>