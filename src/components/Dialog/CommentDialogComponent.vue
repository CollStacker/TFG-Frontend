<template>
  <div class="comments-container">
    <div v-for="comment in comments" :key="comment._id" class="comment">
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
import { ref } from 'vue';

interface Comment {
  _id?: number;
  userId: string;
  publicationDate: Date;
  content: string;
}

const comments = ref<Comment[]>([
  { _id: 1, userId: 'User1', publicationDate: new Date(), content: 'Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!Great product!' },
  { _id: 2, userId: 'User2', publicationDate: new Date(), content: 'Really enjoyed using this.' },
  { _id: 3, userId: 'User3', publicationDate: new Date(), content: 'Highly recommend!' },
  { _id: 1, userId: 'User1', publicationDate: new Date(), content: 'Great product!' },
  { _id: 2, userId: 'User2', publicationDate: new Date(), content: 'Really enjoyed using this.' },
  { _id: 3, userId: 'User3', publicationDate: new Date(), content: 'Highly recommend!' },
  { _id: 1, userId: 'User1', publicationDate: new Date(), content: 'Great product!' },
  { _id: 2, userId: 'User2', publicationDate: new Date(), content: 'Really enjoyed using this.' },
  { _id: 3, userId: 'User3', publicationDate: new Date(), content: 'Highly recommend!' },
]);

const newCommentText = ref('');

const addComment = () => {
  if (newCommentText.value.trim()) {
    const newComment: Comment = {
      _id: comments.value.length + 1,
      userId: 'New User',  // Replace with the actual user's name in a real application
      publicationDate: new Date(),
      content: newCommentText.value,
    };
    comments.value.push(newComment);
    newCommentText.value = '';
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleTimeString();
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
  margin-top: 20px;
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
