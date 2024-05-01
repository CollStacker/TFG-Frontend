<template>
  <div v-if="props.collection">  
    {{ props.collection }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  collection: {
    type: Object
  }
})
</script>

<style scoped>

</style>