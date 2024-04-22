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
                <div class="secondSplitterHeader mb-8">
                  <span class="uppercase bold big-text" >Change Password</span>
                  <div class="separator"></div>
                </div>
                <div style="display:flex">
                  <div style="flex: 1; margin-right: 20px;">
                    <div class="userProfileSettingsform mb-8">
                      <span class="uppercase bold">Current Password</span>
                      <Password class="settingCustomPassword" v-model="currentPassword" toggleMask :feedback="false" />
                    </div>
                    <div class="userProfileSettingsform mb-8">
                      <span class="uppercase bold">New password</span>
                      <Password class="settingCustomPassword" v-model="newPassword" toggleMask >
                        <template #footer>
                            <Divider />
                            <p class="mt-2">Suggestions</p>
                            <ul class="pl-2 ml-20 mt-0" style="line-height: 1.5">
                                <li>At least one lowercase</li>
                                <li>At least one uppercase</li>
                                <li>At least one numeric</li>
                                <li>At least one icon(@/"$..)</li>
                                <li>Minimum 8 characters</li>
                            </ul>
                        </template>
                    </Password>
                    </div>
                    <div class="userProfileSettingsform mb-8">
                      <span class="uppercase bold">Repeat new password</span>
                      <Password class="settingCustomPassword" v-model="repeatedNewPassword" toggleMask :feedback="false" />
                      <p class="error-message" v-if="!checkPassword() && repeatedNewPassword.length > 0">Password does not match</p>
                    </div>
                    <div class="mb-15 mt-12">
                      <Button class="customSettingsButton" label="Change password" @click="changePassword()"/>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="secondSplitterDisplay == 'Delete Account'">
                <div class="secondSplitterHeader mb-8">
                  <span class="uppercase bold big-text red-text" >Delete Account</span>
                  <div class="separator"></div>
                </div>
                <div style="display:flex">
                  <div style="flex: 1; margin-right: 20px;">
                    <div class="userProfileSettingsform mb-8">
                      <label>Deleting your account means loose all your data inside the application. As well as the elements shared with the rest of the application users. Make sure you are safe performing this action</label>
                    </div>
                    <div class="mb-8 align-horizontal">
                      <Checkbox v-model="deleteAccCheckBox" inputId="deleteAccCheckbox" :binary="true"/>
                      <label class="ml-4">  
                        Are you sure you want to <label class="bold red-text uppercase">delete</label> your account?
                      </label>
                    </div>
                    <div v-if="deleteAccCheckBox === true" class="userProfileSettingsform mb-8">
                      <label>{{ "If you are sure to delete your account then write ('" + userData.username + "')."  }}</label>
                      <InputText class="customSettingsInputText" v-model="deleteAccConfirmated" placeholder="Username"/>
                    </div>
                    <div class="mb-15 mt-12">
                      <Button class="deleteAccountButton" label="Delete account" @click="deleteAccount()" :disabled="!(deleteAccConfirmated === userData.username && deleteAccConfirmated !== '')"/>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="secondSplitterDisplay == 'Email'">
                <div class="secondSplitterHeader mb-8">
                  <span class="uppercase bold big-text" >Email</span>
                  <div class="separator"></div>
                </div>
              </template>
              <template v-if="secondSplitterDisplay == 'Notifications'">
                <div class="secondSplitterHeader mb-8">
                  <span class="uppercase bold big-text" >Notifications</span>
                  <div class="separator"></div>
                </div>
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
import Password from 'primevue/password';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import Menu from 'primevue/menu';
import { ref } from "vue";
import { userAuthentication } from '@/store/userAuth.store';
import { useRouter } from 'vue-router';
import { API_URI } from '@/types/env';
import Swal from 'sweetalert2'

const router = useRouter();
const authStore = userAuthentication();

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

// UPDATE USER DATA

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
        title: "Great!",
        text: "Your account have been updated!",
        icon: "success"
      });
    }
  } else {
    router.push('/');
  }
}

// CHANGE PASSWORD 

const currentPassword = ref("");
const newPassword = ref("");
const repeatedNewPassword = ref("");

const isCorrectPassword = (password: string) => {
  const securityPasswordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
  return securityPasswordRegex.test(password);
}

const changePassword = async () => {
  if (currentPassword.value == "" || repeatedNewPassword.value == "" || newPassword.value == "") {
    Swal.fire({
      title: 'Error!',
      text: 'All fields must be filled.',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
    return;
  } else {
    if (newPassword.value !== repeatedNewPassword.value) {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords does not match!',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    } else if (currentPassword.value === newPassword.value) {
      Swal.fire({
        title: 'Error!',
        text: 'Could not use old password again. Try a new password!',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    } else if(!isCorrectPassword(newPassword.value)) {
      Swal.fire({
        title: 'Error!',
        text: 'Password is weakness!! Do it better!!',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    } else {
      const userAuthenticated = await authStore.checkToken();
      if (!userAuthenticated) {
        router.push('/')
      } else {    
        const changePasswordRequiredData = {
          currentPassword: currentPassword.value,
          newPassword: newPassword.value
        }
        const passwordChanged = await fetch(API_URI + `/changePassword/${userData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.getToken()}`,
          },
          body: JSON.stringify(changePasswordRequiredData),
        })
        if (!passwordChanged.ok) {
          Swal.fire({
            title: 'Error!',
            text: 'Server can not proccess your petition.',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        } else {
          Swal.fire({
            title: "Great!",
            text: "Your password have been changed!",
            icon: "success"
          });
        }
      }
    }
  }
}

const checkPassword = ():boolean => {
  return newPassword.value == repeatedNewPassword.value
}

// DELETE ACCOUNT 

const deleteAccCheckBox = ref(false);
const deleteAccConfirmated = ref("");

const deleteAccount = async () => {
  const userAuthenticated = await authStore.checkToken();
  if (!userAuthenticated) {
    router.push('/')
  } else {
    const userDeleted = await fetch(API_URI + `/user/${userData.id}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.getToken()}`,
      },
    });
    if(userDeleted.ok) {
      Swal.fire({
        icon: "success",
        title: "Your account is being deleted!",
        showConfirmButton: false,
        timer: 1700
      });
      setTimeout(function() {
        router.push('/');
      }, 1700);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Server can not proccess your petition.Try it again!',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
  }
}
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

.mt-12 {
  margin-top: 12px;
}

.mt-0 {
  margin-top: 0px;
}

.ml-20 {
  margin-left: 20px;
}

.pl-2 {
  padding: 2px;
}

.red-text {
  color: rgb(246, 71, 71);
}

.ml-4 {
  margin-left: 4px;
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
}

button.p-button.p-component.customSettingsButton:hover {
  color: #333;
  border: 2px solid #333;
  background-color: white;
  transform: scale(1);
}

button.p-button.p-component.deleteAccountButton {
  background-color: rgb(246, 71, 71);
  border: 2px solid rgb(246, 71, 71);
}

button.p-button.p-component.deleteAccountButton:hover {
  color: rgb(246, 71, 71);
  border: 2px solid rgb(246, 71, 71);
  background-color: white;
}

.p-password.p-component.p-inputwrapper.settingCustomPassword {
  max-width: 15.8rem;
}

.p-password.p-component.p-inputwrapper.settingCustomPassword input.p-inputtext.p-component.p-password-input {
  margin: 0px;
  max-width: 24rem;
  border: 1px solid #c7c7c7;
  background-color: transparent;

}

.p-button-label {
  font-weight: bold;
  /* text-transform: uppercase; */
}

.error-message {
  color: red !important;
  margin-top: 0px !important;
  margin-bottom: 2px;
  text-align: left !important;
}

.align-horizontal {
  display: flex;
  align-items: center;
}

</style>