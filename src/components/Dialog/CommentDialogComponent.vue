<template>
  <div class="comments-container" ref="dialogComments">
    <div v-for="comment in comments" :key="comment._id" class="comment" >
      <div class="comment-header">
        <span class="comment-author">{{ comment.userId }}</span>
        <span class="comment-date">{{ formatDate(comment.publicationDate) }}</span>
      </div>
      <div class="comment-body">
        <p>{{ comment.content }}</p>
      </div>
    </div>
    <div class="new-comment">
      <input v-model="newCommentText" type="text" placeholder="Add a comment..." class="new-comment-input" />
      <button @click="addComment" class="new-comment-button">Post</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref,onMounted } from 'vue';
import { userAuthentication } from '@/store/userAuth.store';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import { API_URI } from '@/types/env';
import { type UserInterface } from '@/types/user';

onMounted(async () => {
  await getComments();
  await getCommentsOwner();
  scrollToBottom();
})

const props = defineProps({
  currentProduct: {
    type: Object
  },
})

interface Comment {
  _id?: number;
  userId: string;
  publicationDate: Date;
  content: string;
  productId: string;
}

const toast = useToast();
const authStore = userAuthentication();
const router = useRouter();

const comments = ref<Comment[]>([]);
const commentsOwner = ref<UserInterface[]>([]);

const newCommentText = ref('');

const addComment = async () => {
  if (newCommentText.value.trim()) {
    const newComment: Comment = {
      content: newCommentText.value,
      publicationDate: new Date(),
      userId: authStore.getUserData().id, 
      productId: props.currentProduct ? props.currentProduct._id : '',
    };

    if(!authStore.checkToken()) {
      router.push('/')
    } else {
      const response = await fetch(API_URI + `/productComments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.getToken()}`,
        },
        body: JSON.stringify(newComment),
      })
      if(!response.ok) {
        toast.add({ severity: 'error', summary: 'Error Message', detail: 'Error posting comment.', life: 3000 });
      } else {
        toast.add({ severity: 'success', summary: 'Categorie created', detail: `Comment posted`, life: 3000 });
        comments.value.push(await response.json());
      }
    }

    newCommentText.value = '';
  }
};

const getComments = async () => {
  if(!authStore.checkToken()) {
    router.push('/')
  } else {
    const response = await fetch(API_URI + `/productComments/byProductId/${props.currentProduct ? props.currentProduct._id : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
    })
    if(!response.ok) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Error getting comment.', life: 3000 });
    } else {
      comments.value = await response.json();
    }
  }
}

const getCommentsOwner = async () => {
  if(comments.value) {
    if(!authStore.checkToken()) {
    router.push('/')
  } else {
      for( const comment of comments.value) {
        const response = await fetch(API_URI + `/findUserById/${comment.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.getToken()}`,
          },
        })
        if(!response.ok) {
          toast.add({ severity: 'error', summary: 'Error Message', detail: 'Something wrong finding comment owner.', life: 3000 });
        } else {
          commentsOwner.value.push(await response.json());
        }
      }
    }
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleTimeString();
};

const dialogComments = ref<HTMLDivElement | null>(null);
const scrollToBottom = () => {
  const container = dialogComments.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

</script>

<style scoped>
.comments-container {
  padding: 20px;
  /* max-height: 60vh; */
  overflow-y: auto;
}

.comment {
  background: #f7f7f7;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 15px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.comment:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 10px;
  color: #555;
}

.comment-author {
  color: #3498db;
  font-size: 1.1em;
}

.comment-date {
  color: #aaa;
  font-size: 0.9em;
}

.comment-body {
  color: #333;
  line-height: 1.6;
  font-size: 1em;
  font-family: "Roboto", sans-serif;
}

.new-comment {
  display: flex;
  margin-top: auto;
  padding: 10px 0;
  background-color: #fff;
  position: sticky;
  bottom: 0;
  border-top: 1px solid #e0e0e0;
}

.new-comment-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-right: 10px;
}

.new-comment-button {
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: 1px solid #333;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Inter var", sans-serif;
  font-weight: bold;
}

.new-comment-button:hover {
  background-color: white;
  color: #333;
  border: 1px solid #333;
}
</style>
