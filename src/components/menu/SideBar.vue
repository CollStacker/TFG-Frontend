
<template>
  <div class="sideBarContainer">
    <Menu :model="items" class="customSidebar w-full md:w-15rem">
      <template #start class="customSideBarLogoContainer">
        <!-- <img src="../../assets/imgs/logo.png" class="customSideBarLogo"/> -->
        <span class="customLogoText">Collstacker</span>
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
  min-width: 25vh;
  min-height: 100vh;
  background-image: url('../../assets/imgs/sidebar/sidebar.jpg');
  background-size: cover;
  background-position: center;
}


.p-menu.p-component.p-ripple-disabled.customSidebar {
  background-color: transparent;
  border-radius: 0px;
  border: none;
  min-width: 25vh;
}

.p-submenu-header {
  background-color: transparent;
}

.customSideBarIcon,
.customSideBarText{
  font-weight: bold;
  color: white;
  font-size: 16px;
}

.customSideBarText {
  margin-left: 7px;
  font-family: Roboto, Arial, Helvetica, sans-serif;
  text-transform: uppercase;
  line-height: 31px;
  font-weight: 600;
}

.customSideBarIcon {
  margin-left: 6px;
}

.p-menuitem:hover .customSideBarText, 
.p-menuitem:hover .customSideBarIcon {
  color: black; 
  transform: scale(1.1);
}

.p-menuitem:hover .customSideBarText {
  margin-left: 12px;
}

.customLogoText {
  color: white;
  font-size: 20px; 
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  text-transform: uppercase;
  margin-left: 16px;
  margin-right: 3px;
  font-weight: bold; 
  margin-top: 12px; 
  letter-spacing: 2px; 
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
}

.customLogoText:hover {
  cursor: pointer;
}

.customSideBarLogo {
  object-fit: cover;
  max-width: 6vh;
  border-radius: 50px;
  padding: 3px;
  margin-top: 5px;
  margin-left: 11px;
}

.p-menu-start {
  display: flex;
  align-items: center;
  min-height: 5vh;
}

</style>