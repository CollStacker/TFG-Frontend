<template >
<div>
  <div class="navBarContainer">
    <Menubar :model="items" class="customNavBar">
      <template #start>
        <Toast/>
        <div class="searchInputText">
          <span class="customSearchLogo pi pi-search"></span>
          <InputText v-model="currentUser" placeholder="Search" type="text" class="customNavBarInputText" @keydown.enter="searchUser" />
          <span v-if="locale === 'en'" class="tText" @click="changeLanguage('es')">En</span>
          <span v-if="locale==='es'" class="tText" @click="changeLanguage('en')">Es</span>
        </div>
      </template>
      <template #item="{item, props, hasSubmenu, root}">
        <a v-ripple class="customNavbarItem flex align-items-center" v-bind="props.action" @click="handleNavbar(item.label)">
          <span :class="item.icon" />
          <span class="customNavbarText">{{ item.label }}</span>
          <Badge v-if="item.badge && friendRequests && friendRequests.length > 0" class="customNavbarBadge" severity="contrast" :value="friendRequests.length" />
          <i v-if="hasSubmenu" :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
        </a>
      </template>
    </Menubar> 
  </div>
</div>
    
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import Badge from 'primevue/badge';
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import { userAuthentication } from '@/store/userAuth.store';
import { API_URI } from '@/types/env';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

import { useI18n } from 'vue-i18n'
const {t, locale } = useI18n();

const changeLanguage = (lang: string) => {
  locale.value = lang;
};

const toast = useToast();
const authStore = userAuthentication();

const router = useRouter();

const emits = defineEmits(["refreshPage"])

onMounted(async () => {
  await getFriendRequest();
});

const friendRequests = ref<{_id: string, userId: string, requestUserId: string}[]>();
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

const items = ref([
    {
        label: t('Messages'),
        icon: 'pi pi-comments',
        badge: 2
    },
    {
        label: t('Account'),
        icon: 'pi pi-user',
        items: [
            {
                label: t('My profile'),
                icon: 'pi pi-user'
            },
            {
                label: t('My collections'),
                icon: 'pi pi-server'
            },
            {
                label: t('Help'),
                icon: 'pi pi-question-circle'
            },
            {
                label: t('Log out'),
                icon: 'pi pi-sign-out'
            },
        ]
    },
    {
        label: t('Settings'),
        icon: 'pi pi-cog'
    }
]);


const handleNavbar = (label: string | ((...args: any) => string) | undefined) => {
  var itemSelected = ""; 
  if (label) {
    itemSelected = label.toString();
  }
  switch (itemSelected) {
    case t('Messages'):
      router.push('/messages')
      break;
    case t('My profile'):
      router.push('/userProfile')
      break;
    case t('Help'):
      
      break;
    case t('My collections'):
      router.push('/collections')
      break;
    case t('Log out'):
      authStore.clearStore();
      router.push('/')
      break;
    case t('Settings'):
      router.push('/settings')
      break;
    default:
      break;
  }
}

const currentUser = ref<string>("")
const searchUser = async () => {
  if(!await authStore.checkToken()) {
    router.push('/')
  } else {
    if(currentUser.value !== "") {
      // process data
      const foundedUser = await fetch(API_URI + `/findUser/${currentUser.value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.getToken()}`,
        },
      })
      if (!foundedUser.ok) {
        toast.add({ severity: 'error', summary: 'Error Message', detail: t('User not found'), life: 5000 });
      } else {
        const foundedUserJSON = await foundedUser.json();
        authStore.setFoundedUserData(foundedUserJSON);
        emits("refreshPage")
        router.push('/userFounded')
      }
  
      // Reset of currenUser ref var
      currentUser.value = "";
    }
  }
}

</script>

<style>

.p-menubar.p-component.customNavBar {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border-radius: 0px;
  border-left: 0px;
  border-top: 0px;
  border-right: 0px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.p-inputtext.p-component.customNavBarInputText {
  height: 2.5rem;
  width: 18rem;
  margin-left: 0px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: none;
}

.p-inputtext.p-component.customNavBarInputText:focus {
  border: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.customNavbarText {
  margin-left: 4px;
}

.customNavbarBadge {
  margin-left: 4px;
}

.p-menubar.p-component.customNavBar ul {
  position: absolute;
  right: 0;
  margin-right: 10px;
}

.customSearchLogo {
  display: flex;
  justify-content: center; 
  align-items: center;
  margin-right: 0px;
  margin-left: 8px;
  background-color: #eee;
  height: 2.5rem;
  border-top-left-radius: 7px;
  border-bottom-left-radius: 7px;
  padding: 4px;
}

.customSearchLogo.pi.pi-search {
  color: #334155;
}

.searchInputText {
  display: flex;
  align-items: center;
}

.customNavbarItem::before,
.customNavbarItem::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: black;
  transition: width 0.3s ease-in-out;
}

.customNavbarItem::before {
  left: 50%;
  transform-origin: left;
}

.customNavbarItem::after {
  right: 50%;
  transform-origin: right;
}

.customNavbarItem:hover::before,
.customNavbarItem:hover::after {
  width: 50%;
}

.tText:hover {
  transform: scale(1.1);
  cursor: pointer;
}

</style>