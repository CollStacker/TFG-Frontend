<template>
  <div class="navBarContainer">
    <Menubar :model="items" class="customNavBar">
      <template #start>
        <Toast/>
        <div class="searchInputText">
          <span class="customSearchLogo pi pi-search"></span>
          <InputText v-model="currentUser" placeholder="Search" type="text" class="customNavBarInputText" @keydown.enter="searchUser" />
        </div>
      </template>
      <template #item="{item, props, hasSubmenu, root}">
        <a v-ripple class="customNavbarItem flex align-items-center" v-bind="props.action" @click="handleNavbar(item.label)">
          <span :class="item.icon" />
          <span class="customNavbarText">{{ item.label }}</span>
          <Badge v-if="item.badge" class="customNavbarBadge" severity="contrast" :value="item.badge" />
          <i v-if="hasSubmenu" :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
        </a>
      </template>
    </Menubar> 
  </div>
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import Badge from 'primevue/badge';
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { userAuthentication } from '@/store/userAuth.store';
import { API_URI } from '@/types/env';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const authStore = userAuthentication();

const router = useRouter();
const items = ref([
    {
        label: '',
        icon: 'pi pi-comments',
        badge: 2
    },
    {
        label: 'Account',
        icon: 'pi pi-user',
        items: [
            {
                label: 'My profile',
                icon: 'pi pi-user'
            },
            {
                label: 'My collections',
                icon: 'pi pi-server'
            },
            {
                label: 'Help',
                icon: 'pi pi-question-circle'
            },
            {
                label: 'Log out',
                icon: 'pi pi-sign-out'
            },
        ]
    },
    {
        label: 'Settings',
        icon: 'pi pi-cog'
    }
]);


const handleNavbar = (label: string | ((...args: any) => string) | undefined) => {
  var itemSelected = ""; 
  if (label) {
    itemSelected = label.toString();
  }
  switch (itemSelected) {
    case 'Notification':
      
      break;
    case 'My profile':
      router.push('userProfile')
      break;
    case 'Help':
      
      break;
    case 'My collections':
      router.push('/collections')
      break;
    case 'Log out':
      authStore.clearStore();
      router.push('/')
      break;
    case 'Settings':
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
        toast.add({ severity: 'error', summary: 'Error Message', detail: 'User not found.', life: 5000 });
      } else {
        const foundedUserJSON = await foundedUser.json();
        authStore.setFoundedUserData(foundedUserJSON);
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

</style>