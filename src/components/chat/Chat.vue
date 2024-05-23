<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Chat</h2>
      <span class="closeButton pi pi-times"></span>
    </div>
    <div class="chat-messages">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="{'message-sent': message.senderId === userId, 'message-received': message.senderId !== userId}"
        class="message">
        <div class="message-content">
          <p>{{ message.content }}</p>
          <span class="message-date">{{ formatDate(message.date) }}</span>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Type your message here..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Message {
  id: number;
  content: string;
  date: Date;
  senderId: string;
  receiverId: string;
}

const props = defineProps({
  friend: {
    type: Object
  },
})

const messages = ref<Message[]>([
  { id: 1, content: 'Hello!', date: new Date(), senderId: 'user1', receiverId: 'user2' },
  { id: 2, content: 'Hi, how are you?', date: new Date(), senderId: 'user2', receiverId: 'user1' },
]);

const newMessage = ref('');
const userId = 'user1';

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    messages.value.push({
      id: Date.now(),
      content: newMessage.value,
      date: new Date(),
      senderId: userId,
      receiverId: 'user2',
    });
    newMessage.value = '';
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleTimeString();
};
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
  text-align: center;
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
  align-self: flex-end;
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

.closeButton:hover {
  transform: scale(1.1);
  cursor: pointer;
}
</style>
