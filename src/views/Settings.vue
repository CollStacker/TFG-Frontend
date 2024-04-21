<template>
  <div class="settingsContainer"> 
    <SideBar class="sidebar"></SideBar>
    <div class="settingsContent">
      <NavBar class="customNavBar"></NavBar>
      <div class ="settingsMainContent">
        <Splitter class="customSettingsSplitter">
            <SplitterPanel class="" :size="14" :minSize="14" >
              <Menu :model="items" class="customFirstSplitterMenu">
                <template #submenuheader="{ item }">
                  <span class="splitterSubMenuHeader uppercase">{{ item.label }}</span>
                </template>
                <template #item="{ item, props }">
                  <a v-ripple class="" v-bind="props.action" @click="handleRoutering(item.label)">
                    <span :class="item.icon" />
                    <span class="menuText">{{ item.label }}</span>
                  </a>
                </template>
              </Menu>
            </SplitterPanel>
            <SplitterPanel class="customSecondtSplitterMenu" :size="87" :minSize="10">
              <template v-if="secondSplitterDisplay == 'User Profile'">
                <div class="secondSplitterHeader mb-8">
                  <span class="uppercase bold big-text" >User profile</span>
                  <div class="separator"></div>
                </div>
                <div style="display:flex">
                  <div style="flex: 1; margin-right: 20px;">
                    <div class="userProfileSettingsform mb-8">
                      <span class="uppercase bold">Username</span>
                      <InputText class="customSettingsInputText" v-model="newUserData.username" :placeholder="userData.username"/>
                      <small>Your username is public for other users, with it other collectors can access your profile. You can change it at any time</small>
                    </div>
                    <div class="userProfileSettingsform mb-8">
                      <span class="uppercase bold">Email</span>
                      <InputText class="customSettingsInputText" v-model="newUserData.email" :placeholder="userData.email"/>
                      <small>Your email is private for other users. You can change it at any time</small>
                    </div>
                    <div class="userProfileSettingsform mb-8">
                      <span class="uppercase bold">Name</span>
                      <InputText class="customSettingsInputText" v-model="newUserData.name" :placeholder="userData.name"/>
                      <small>Your name is public for other users. You can change it at any time</small>
                    </div>
                    <div class="userProfileSettingsform mb-8">
                      <span class="uppercase bold">Surnames</span>
                      <InputText class="customSettingsInputText" v-model="newUserData.surnames" :placeholder="userData.surnames"/>
                      <small>Your surnames is public for other users. You can change it at any time</small>
                    </div>
                    <div class="userProfileSettingsform mb-8">
                      <span class="uppercase bold">Biography</span>
                      <Textarea class="userProfileSettingTextArea" v-model="newUserData.biography" :placeholder="userData.biography" :autoResize="true"/>
                      <small>Your biography is public for other users, represents the way users see you. You can change it at any time</small>
                    </div>
                    <div class="mb-15">
                      <Button class="customSettingsButton" label="Update profile" @click="updateProfile()"/>
                    </div>
                  </div>
                  <div class="userProfileSettingsform mr-20">
                    <span class="uppercase bold" >Profile picture</span>
                    <img v-if="newUserData.profilePhoto === ''" class="customAvatar" @click="dialogVisible = true" src="../assets/imgs/profilePhoto/camera_icon.png"></img>
                    <img v-if="newUserData.profilePhoto === 'maleYoung'" class="customProfilePhoto" @click="dialogVisible = true" src="../assets/imgs/profilePhoto/male-young.jpg"/>
                    <img v-if="newUserData.profilePhoto === 'maleAdult'" class="customProfilePhoto" @click="dialogVisible = true" src="../assets/imgs/profilePhoto/male-adult.jpg"/>
                    <img v-if="newUserData.profilePhoto === 'maleOld'" class="customProfilePhoto" @click="dialogVisible = true" src="../assets/imgs/profilePhoto/male-old.jpg"/>
                    <img v-if="newUserData.profilePhoto === 'femaleOld'" class="customProfilePhoto" @click="dialogVisible = true" src="../assets/imgs/profilePhoto/female-old.jpg"/>
                    <img v-if="newUserData.profilePhoto === 'femaleAdult'" class="customProfilePhoto" @click="dialogVisible = true" src="../assets/imgs/profilePhoto/female-adult.jpg"/>
                    <img v-if="newUserData.profilePhoto === 'femaleYoung'" class="customProfilePhoto" @click="dialogVisible = true" src="../assets/imgs/profilePhoto/female-young.jpg"/>
                  </div>
                </div>
                <Dialog v-model:visible="dialogVisible" modal style="width:53rem;" :closable="false" :showHeader="false" class="customDialog">
                  <section>
                    <img src="../assets/imgs/profilePhoto/male-young.jpg" @click="selectProfilePhoto('maleYoung')"></img>
                    <img src="../assets/imgs/profilePhoto/male-adult.jpg" @click="selectProfilePhoto('maleAdult')"></img>
                    <img src="../assets/imgs/profilePhoto/male-old.jpg" @click="selectProfilePhoto('maleOld')"></img>
                    <img src="../assets/imgs/profilePhoto/female-old.jpg" @click="selectProfilePhoto('femaleOld')"></img>
                    <img src="../assets/imgs/profilePhoto/female-adult.jpg" @click="selectProfilePhoto('femaleAdult')"></img>
                    <img src="../assets/imgs/profilePhoto/female-young.jpg" @click="selectProfilePhoto('femaleYoung')"></img>
                  </section>
                </Dialog>
              </template>
              <template v-if="secondSplitterDisplay == 'Change Password'">
                
              </template>
              <template v-if="secondSplitterDisplay == 'Delete Account'">
                
              </template>
              <template v-if="secondSplitterDisplay == 'Email'">
                Welcome from user email settings
              </template>
              <template v-if="secondSplitterDisplay == 'Notifications'">
                Welcome from user notifications settings
              </template>
            </SplitterPanel>
        </Splitter>
      </div>
      <Footer class="customFooter"></Footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/menu/SideBar.vue';
import NavBar from '@/components/menu/NavBar.vue';
import Footer from '@/components/menu/Footer.vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import Menu from 'primevue/menu';
import { ref } from "vue";
import { userAuthentication } from '@/store/userAuth.store';
import { useRouter } from 'vue-router';
import { API_URI } from '@/types/env';
import Swal from 'sweetalert2'

const router = useRouter();
const authStore = userAuthentication();
const secondSplitterDisplay = ref("User Profile");

const dialogVisible = ref(false);
const userData = authStore.getUserData();

const newUserData = ref({
  username: userData.username,
  email: userData.email,
  name: userData.name,
  surnames: userData.surnames,
  biography: userData.biography,
  profilePhoto: userData.profilePhoto
});

const handleRoutering = (label: string | ((...args: any) => string) | undefined) => {
  var elementSelected = "";
  if (label !== undefined) {
    elementSelected = label.toString();
  }
  switch (elementSelected) {
    case 'User Profile':
      secondSplitterDisplay.value = elementSelected;
      break;
    case 'Change Password':
      secondSplitterDisplay.value = elementSelected;
      break;
    case 'Delete Account':
      secondSplitterDisplay.value = elementSelected;
      break;
    case 'Email':
      secondSplitterDisplay.value = elementSelected;
      break;
    case 'Notifications':
      secondSplitterDisplay.value = elementSelected;
      break;
    default:
      break;
  }
}

const selectProfilePhoto = (pictureSelected: String) => {
  switch (pictureSelected) {
    case 'femaleYoung':
      newUserData.value.profilePhoto = 'femaleYoung';
      dialogVisible.value = false;
    break;
    case 'femaleAdult':
      newUserData.value.profilePhoto = 'femaleAdult';
      dialogVisible.value = false;
    break;
    case 'femaleOld':
      newUserData.value.profilePhoto = 'femaleOld';
      dialogVisible.value = false;
    break;
    case 'maleYoung':
      newUserData.value.profilePhoto = 'maleYoung';
      dialogVisible.value = false;
    break;
    case 'maleAdult':
      newUserData.value.profilePhoto = 'maleAdult';
      dialogVisible.value = false;
    break;
    case 'maleOld':
      newUserData.value.profilePhoto = 'maleOld';
      dialogVisible.value = false;
    break;
    default:
      newUserData.value.profilePhoto = "defaultProfilePhoto";
      dialogVisible.value = false
    break;
  }
}

const updateProfile = async () => {
  const userAuthenticated = await authStore.checkToken();
  if (userAuthenticated) {
    const updateUser = await fetch(API_URI + `/updateUser/${userData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
      body: JSON.stringify(newUserData.value),
    });
    if (!updateUser.ok) {
      Swal.fire({
        title: 'Error!',
        text: 'User couldnt be updated',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    } else {
      Swal.fire({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success"
      });
    }
  } else {
    router.push('/');
  }
}

const items = ref([
    {
        label: 'Account',
        items: [
            {
                label: 'User Profile',
                icon: 'pi pi-user'
            },
            {
                label: 'Change Password',
                icon: 'pi pi-key'
            },
            {
                label: 'Delete Account',
                icon: 'pi pi-trash'
            }
        ]
    },
    {
        label: 'Access',
        items: [
            {
                label: 'Email',
                icon: 'pi pi-envelope'
            },
            {
                label: 'Notifications',
                icon: 'pi pi-bell'
            }
        ]
    }
]);

</script>

<style>
.settingsContainer {
  display: flex;
  min-height: 100vh;
}

.settingsContent {
  flex-grow: 1; 
  position: relative;
}

.customNavBar {
  height: 69px; 
  width: 100%;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 768px) {
  .customNavBar {
    height: 69px;
  }
  .mainContent {
  margin-top: 69px;
  }
  .customFooter {
    height: 200px;
  }
}

.customFooter {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
}

.settingsMainContent {
  margin: 69px 0 50px;
  background-color: #f3f2f2;
  min-height: calc(100vh - 69px - 50px);
  padding: 48px;
}

.customSettingsSplitter {
  margin: 10px;
}

.customFirstSplitterMenu {
  margin:5px;
  border: none;
}

.customSecondtSplitterMenu{
  margin:10px
}

.splitterSubMenuHeader {
  font-weight: bold;
  color: #555555;
}

.uppercase {
  text-transform: uppercase;
}

.bold {
  font-weight: bold;
}

.big-text {
  font-size: 30px;
}

.menuText {
  margin-left: 8px;
}

.separator {
  border-bottom: 0.1px solid #555555;
  width: 100%;
}

.mb-8 {
  margin-bottom: 8px;
}

.mb-15 {
  margin-bottom: 15px;
}

.mr-20 {
  margin-right: 20px;
}

.userProfileSettingsform {
  display: flex;
  flex-direction: column;
}

input.p-inputtext.p-component.customSettingsInputText {
  margin: 0px;
  max-width: 24rem;
  border: 1px solid #c7c7c7;
  background-color: transparent;
}

textarea.p-inputtextarea.p-inputtext.p-component.userProfileSettingTextArea {
  background-color: transparent;
  /* border: none; */
}

.customAvatar {
  /* border: 3px solid #FF4B2B; */
  object-fit: cover;
  margin-top: 10px;
  background-color: #eee;
  padding: 30px;
  border-radius: 80px;
  width: 200px;
  height: 200px;
}

.customProfilePhoto {
  object-fit: cover;
  margin-top: 10px;
  background-color: #eee;
  border-radius: 80px;
  width: 200px;
  height: 200px;
}

.customProfilePhoto:hover,
.customAvatar:hover {
  transform: scale(1.1);
}

body {
  margin: 0;
}

section {
  display: flex;
  width: 51.5rem;
  height: 25rem;
}

section img {
  width: 0px;
  flex-grow: 1;
  object-fit: cover;
  opacity: .8;
  transition: .5s ease;
}

section img:hover {
  cursor: pointer; 
  width: 300px;
  opacity: 1;
  filter: contrast(120%);
}

button.p-button.p-component.customSettingsButton {
  background-color: #333;
  border: 2px solid #333;
  border: none;
}

button.p-button.p-component.customSettingsButton:hover {
  color: #333;
  border: 2px solid #333;
  background-color: white;
  transform: scale(1);
}

.p-button-label {
  font-weight: bold;
  /* text-transform: uppercase; */
}


</style>