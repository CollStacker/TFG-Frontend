
<template>
  <div class="sideBarContainer">
    <Menu :model="items" class="customSidebar w-full md:w-15rem">
      <template #start>
        <span class="customLogoText">LOGO + TITLE</span>
      </template>
      <template #item="{ item, props }">
          <a v-ripple class="flex align-items-center" v-bind="props.action">
            <span class="customSideBarIcon" :class="item.icon" />
            <span class="customSideBarText">{{ item.label }}</span>
          </a>
      </template>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Menu from 'primevue/menu';
const items = ref([
  {
    items: [
      {
        separator: true
      },
      {
        label: 'HOME',
        icon: 'pi pi-home',
      },
      {
        label: 'USER PROFILE',
        icon: 'pi pi-user',
      },
      {
        label: 'COLLECTIONS',
        icon: 'pi pi-server'
      },
      {
        label: 'MESSAGES',
        icon: 'pi pi-comments'
      },
      {
        label: 'SETTINGS',
        icon: 'pi pi-cog'
      },
    ]
  },
]);
</script>

<style>

.sideBarContainer {
  display: flex;
  justify-content: start;
  padding: 0;
  min-height: 100vh;
  background-image: url('../../assets/imgs/sidebar/sidebar.jpg');
  background-size: cover;
  background-position: center;
  opacity: .9;
}

.p-menu.p-component.p-ripple-disabled.customSidebar {
  background-color: transparent;
  border-radius: 0px;
  border: none;
}

.p-submenu-header {
  background-color: transparent;
}

.customSideBarIcon,
.customSideBarText{
  color: white;
}

.customSideBarText {
  margin-left: 7px;
}

</style>