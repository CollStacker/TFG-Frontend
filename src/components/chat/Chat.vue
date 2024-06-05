<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="friendData" v-if="props.friend">
        <img class="friendDataProfilePhoto" v-if="props.friend.profilePhoto === 'femaleYoung'" src="../../assets/imgs/profilePhoto/female-young.jpg"/>
        <img class="friendDataProfilePhoto" v-if="props.friend.profilePhoto === 'maleYoung'" src="../../assets/imgs/profilePhoto/male-young.jpg"/>
        <img class="friendDataProfilePhoto" v-if="props.friend.profilePhoto === 'maleAdult'" src="../../assets/imgs/profilePhoto/male-adult.jpg"/>
        <img class="friendDataProfilePhoto" v-if="props.friend.profilePhoto === 'maleOld'" src="../../assets/imgs/profilePhoto/male-old.jpg"/>
        <img class="friendDataProfilePhoto" v-if="props.friend.profilePhoto === 'femaleOld'" src="../../assets/imgs/profilePhoto/female-old.jpg"/>
        <img class="friendDataProfilePhoto" v-if="props.friend.profilePhoto === 'femaleAdult'" src="../../assets/imgs/profilePhoto/female-adult.jpg"/>
        <img class="friendDataProfilePhoto" v-if="props.friend.profilePhoto === 'defaultProfilePhoto'" src="../../assets/imgs/profilePhoto/defaultProfilePhoto.png" />
        <h2>{{ props.friend.username }}</h2>
      </div>
      <span class="closeButton pi pi-times" @click="closeChat()"></span>
    </div>
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
    </div>
    <div v-else class="chat-messages" ref="chatMessages">
      <div
        v-for="message in messages"
        :class="{'message-sent': message.senderId === authStore.getUserData().id, 'message-received': message.senderId !== authStore.getUserData().id}"
        class="message">
        <div class="message-content">
          <p class="linkStyle" v-if="checkIfIsSharedProduct(message.content)" @click="openSharedProduct(message.content)">{{getMessageContentLink(message.content)}}</p>
          <p v-else>{{ message.content }}</p>
          <span class="message-date">{{ formatDate(message.date) }}</span>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        :placeholder="t('Type your message here...')" />
      <button @click="sendMessage">{{t('Send')}}</button>
    </div>
  </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { userAuthentication } from '@/store/userAuth.store';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import { API_URI } from '@/types/env';
import { type UserInterface } from '@/types/user';

import { useI18n } from 'vue-i18n'
const {t} = useI18n();

interface Message {
  _id? : string,
  content: string;
  date: Date;
  senderId: string;
  receiverId: string;
}

const toast = useToast();
const authStore = userAuthentication();
const router = useRouter();

const props = defineProps({
  friend: {
    type: Object
  },
})

const isLoading = ref<boolean>(true);
const emits= defineEmits(["closeChat","openSharedProduct"]);

onMounted(async () => {
  await getConversation();
  scrollToBottom();
  isLoading.value = false;
})

const messages = ref<Message[]>([]);

const newMessage = ref('');

const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    const tmpMessage: Message = {
      content: newMessage.value,
      date: new Date(),
      senderId: authStore.getUserData().id,
      receiverId: props.friend ? props.friend.id : '',
    }
    messages.value.push(tmpMessage);
    if(!await authStore.checkToken()) {
      return('/')
    } else {
      const response = await fetch(API_URI + `/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.getToken()}`,
        },
        body: JSON.stringify(tmpMessage)
      })
      if(!response.ok) {
        toast.add({ severity: 'error', summary: 'Error Message', detail: t('Error posting a message.'), life: 3000 });
      } else {
        getConversation();
      }
    }
    newMessage.value = '';
  }
};

const getConversation = async () => {
  if (!authStore.checkToken()) {
    router.push('/')
  } else {
    const senderId: string = authStore.getUserData().id;
    const friendId: string = props.friend ? props.friend.id : '';
    const response = await fetch(API_URI + `/messages/${senderId}/${friendId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
    });
    if(!response.ok) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: t('Error getting conversation.'), life: 3000 });
    } else {
      messages.value = await response.json();
    }
  }
}

const chatMessages = ref<HTMLDivElement | null>(null);
const scrollToBottom = () => {
  const container = chatMessages.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleTimeString();
};

const closeChat = () => {
  emits("closeChat");
}

const checkIfIsSharedProduct = (messageContent: string): boolean => {
  return messageContent.includes("%#ShArEpRoDuCt#%#CoMpArTiRpRoDuCtO#%#PrOdUkTtEiLeN#%:");
}

const getMessageContentLink = (messageContent: string): string => {
  return "/collstacker/productShared/" + messageContent.substring(53,messageContent.length);
}

const openSharedProduct = (messageContent: string) => {
  emits("openSharedProduct", messageContent.substring(53,messageContent.length));
}

</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  /* height: 100vh; */
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  position: relative;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  background-color: #f4f4f4;
  overflow-y: auto;
}

.message {
  margin: 10px 0;
  max-width: 70%;
  word-wrap: break-word;
}

.message-sent {
  margin-left: auto;
  background-color: #dcf8c6;
  border-radius: 15px 15px 0 15px;
}

.message-received {
  align-self: flex-start;
  background-color: #fff;
  border-radius: 15px 15px 15px 0;
}

.message-content {
  padding: 10px;
  position: relative;
}

.message-date {
  display: block;
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
  text-align: right;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ccc;
  padding: 10px;
  background-color: #fff;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  outline: none;
  background-color: #f4f4f4;
}

.chat-input button {
  padding: 10px 20px;
  background-color: #333;
  border: 1px solid #333;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #fff;
  color: #333;
  border: 1px solid #333;
}

.chat-header div {
  flex: 1;
  text-align: center;
  margin: 0; 
}

.closeButton {
  padding-right: 6px;
  margin-left: auto; 
  cursor: pointer;
}

.closeButton:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.friendDataProfilePhoto {
  max-width: 70px;
  max-height: 70px;
  border-radius: 50px;
}

.friendData {
  display: flex;
  margin-left: auto;
  align-items: center;
}

.friendData h2 {
  margin: 0px;
  margin-left: 15px;
}

.linkStyle {
  color: rgb(63, 63, 216); 
  text-decoration: underline;
  cursor: pointer; 
  transition: color 0.3s ease;
}

.linkStyle:hover {
  color: #00a; 
  text-decoration: underline; 
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8); 
}
</style>
