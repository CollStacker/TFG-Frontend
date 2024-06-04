
<template>
  <div class="sideBarContainer">
    <Menu :model="items" class="customSidebar w-full md:w-15rem">
      <template #start class="customSideBarLogoContainer">
        <!-- <img src="../../assets/imgs/logo.png" class="customSideBarLogo"/> -->
        <span class="customLogoText" @click="handleRoutering('HOME')" >Collstacker</span>
      </template>
      <template #item="{ item, props } ">
          <a v-ripple class="flex align-items-center" v-bind="props.action" @click="handleRoutering(item.label)">
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
import { useRouter } from 'vue-router';

import { useI18n } from 'vue-i18n'
const {t} = useI18n();

const router = useRouter();
const items = ref([
  {
    items: [
      {
        separator: true
      },
      {
        label: t('HOME'),
        icon: 'pi pi-home',
      },
      {
        label: t('USER PROFILE'),
        icon: 'pi pi-user',
      },
      {
        label: t('COLLECTIONS'),
        icon: 'pi pi-server'
      },
      {
        label: t('MESSAGES'),
        icon: 'pi pi-comments'
      },
      {
        label: t('SETTINGS'),
        icon: 'pi pi-cog'
      },
    ]
  },
]);

const handleRoutering = (label: string | ((...args: any) => string) | undefined) => {
  var elementSelected = "";
  if (label !== undefined) {
    elementSelected = label.toString();
  }
  switch (elementSelected) {
    case t('HOME'):
      router.push('/main');
      break;
    case t('USER PROFILE'):
      router.push('/userProfile');
      break;
    case t('COLLECTIONS'):
      router.push('/collections');
      break;
    case t('MESSAGES'):
      router.push('/messages');
      break;
    case t('SETTINGS'):
      router.push('/settings');
      break;
    default:
      break;
  }
}
</script>

<style>

.sideBarContainer {
  display: flex;
  justify-content: start;
  padding: 0;
  min-width: 25vh;
  min-height: 100vh;
  background-image: url('../../assets/imgs/sidebar/sidebar.jpg');
  background-size: contain;
  background-position: center;
  background-attachment: fixed;
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

@media screen and (max-width: 800px) {
  .customLogoText {
    width: 40px; 
    overflow: hidden; 
    white-space: nowrap;
    text-overflow: ellipsis; 
  }
}

/* @media screen and (min-width: 2600px) {
  .p-submenu-header {
    display: none;
  }
} */

@media screen and (min-width: 2300px) {
  .customLogoText {
    min-width: 0;
    margin-top: 0px;
  }
  .p-submenu-header {
    display: none;
  }
  .sideBarContainer {
    min-width: 0; 
  }
  .p-menu.p-component.p-ripple-disabled.customSidebar {
    min-width: 0;
  }
}


.customLogoText:hover {
  cursor: pointer;
  transform: scale(1.05);
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

@media screen and (max-width: 768px) {
  .sideBarContainer {
    display: none; /* Oculta el componente NavBar cuando la pantalla sea muy pequeña */
  }
}

@media screen and (min-width: 2800px) {
  .sideBarContainer {
    display: none; /* Oculta el componente NavBar cuando la pantalla sea muy pequeña */
  }
}

</style>