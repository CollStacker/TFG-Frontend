<template>
  <div id="app">
    <Toast/>
    <div class="container" :class="{ 'right-panel-active': isSignUp }">
      <!-- Register form -->
      <div class="form-container sign-up-container">
        <form @submit.prevent="handleSignUp">
          <template id="registerFormStep1" v-if="registerStep === 0">
            <h1>Create Account</h1>
            <InputText v-model="signUpForm.email" placeholder="Email" />
            <InputText v-model="signUpForm.username" placeholder="Username"/>
            <InputText v-model="signUpForm.name" placeholder="Name" />
            <InputText class="customInputText" v-model="signUpForm.surnames" placeholder="Surnames" />
            <Password class="customPassword" v-model="signUpForm.password" placeholder="Password" toggleMask :feedback="false" />
            <Password class="customPassword" v-model="repeatedPassword" placeholder="Repeat password" toggleMask :feedback="false" />
            <p class="error-message" v-if="!checkPassword() && repeatedPassword.length > 0">Password does not match</p>
            <i class="customNextStepButton pi pi-arrow-right" @click="nextRegisterFormStep"></i>
          </template>
          <template id="registerFormStep2" v-if="registerStep === 1">
            <h1>Choose Profile Photo</h1>
            <img v-if="!photoSelected" class="customAvatar" @click="dialogVisible = true" src="../assets/imgs/profilePhoto/camera_icon.png"></img>
            <Dialog v-model:visible="dialogVisible" modal style="width:55rem;height: 31rem; " :closable="false" class="customDialog">
              <section>
                <img src="../assets/imgs/profilePhoto/male-young.jpg" @click="dialogVisible = false"></img>
                <img src="../assets/imgs/profilePhoto/male-adult.jpg"></img>
                <img src="../assets/imgs/profilePhoto/male-old.jpg"></img>
                <img src="../assets/imgs/profilePhoto/female-old.jpg"></img>
                <img src="../assets/imgs/profilePhoto/female-adult.jpg"></img>
                <img src="../assets/imgs/profilePhoto/female-young.jpg"></img>
              </section>
            </Dialog>
            <div class="button-container">
              <i class="customPreviousStepButton pi pi-arrow-left" @click="previousRegisterFormStep"></i>
              <i class="customNextStepButton pi pi-arrow-right" @click="nextRegisterFormStep"></i>
            </div>
          </template>
          <template id="registerFormStep3" v-if="registerStep === 2">
            <h1>Wrapping up, last configurations</h1>      
            <Textarea v-model="signUpForm.biography" placeholder="Biography" class="fixed-size-textarea"/>
            <div class="licenseCheckBox flex">
              <Checkbox v-model="licenseAndConditionsReaded" :binary="true" class="custom-checkbox"/>
                <label > I have read and accept the </label>
                <a href="">Legal Notice </a>
                <label>and the </label>
                <a href="">Privacy Policies.</a>
            </div>
            <div class="button-container">
              <i class="customPreviousStepButton pi pi-arrow-left" @click="previousRegisterFormStep"></i>
              <button class="customSignUpButton" type="submit">Sign Up</button>
            </div>
          </template>
        </form>
      </div>
      <!-- Login form -->
      <div class="form-container sign-in-container">
        <form @submit.prevent="handleSignIn">
          <h1 class="sing-in-title">Sign in</h1>
          <InputText v-model="signInForm.email" placeholder="Email account" />
          <Password v-model="signInForm.password" placeholder="Password" toggleMask :feedback="false" />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <!-- Register left panel-->
          <div class="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button class="ghost" @click="toggleSignIn">Sign In</button>
          </div>
          <!-- Login right panel-->
          <div class="overlay-panel overlay-right">
            <h1>Hello, Collector!</h1>
            <p>Are you still not registered?. Enter your personal details and start journey with us</p>
            <button class="ghost" @click="toggleSignIn">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <p>
        Created by
        <a target="_blank" href="https://github.com/Adrian-glz01">Adrián González Expósito</a>
        - As a application for the final degree project.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';
import { useToast } from "primevue/usetoast";
import { ref } from 'vue';

const toast = useToast();

const wrongPasswordErrorMessage = "Password must be greater than 8 characters.\n Must have at least one number, one capital letter and one non-alphanumeric character"

const isSignUp = ref(false);
const signUpForm = ref({
  username: '',
  email: '',
  password: '',
  realm: '',
  emailVerified: true,
  verificationToken: '',
  name: '',
  surnames: '',
  profilePhoto: '',
  biography: '',
});
const repeatedPassword = ref('');
const registerStep = ref(1);
const signInForm = ref({email: '', password: ''});
const photoSelected = ref(false);
const licenseAndConditionsReaded = ref(false);
const dialogVisible = ref(false);

const handleSignUp = () => {
  console.log('Sign up form submitted:', signUpForm.value);
  if (!licenseAndConditionsReaded.value) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Please accept the terms and conditions of use first.', life: 3000 });
  } else  {
    // crear cuenta y si todo ha salido bien, refrescar pagina
    registerStep.value = 0; //!DE MOMENTO MANTENER, SE BORRARA CUANDO SE TENGA LA FUNCIONALIDAD
  }
};

const handleSignIn = () => {
  if (signInForm.value.email === '' || signInForm.value.password === '' ) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Every fields must be filled.', life: 3000 });
  }
  console.log('Sign in form submitted:', signInForm.value);
};

const toggleSignIn = () => {
  isSignUp.value = !isSignUp.value;
};

const checkPassword = ():boolean => {
  return signUpForm.value.password == repeatedPassword.value
}

const isCorrectPassword = () => {
  const securityPasswordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
  return securityPasswordRegex.test(signUpForm.value.password);
}

const areAllRegisterStepOneFieldsFilled = () => {
  return signUpForm.value.password !== '' &&  
    repeatedPassword.value !== '' &&
    signUpForm.value.username !== '' && 
    signUpForm.value.email !== '' && 
    signUpForm.value.surnames !== '' &&
    signUpForm.value.name !== ''
}

const nextRegisterFormStep = () => {
  if (registerStep.value == 0) {
    if (!areAllRegisterStepOneFieldsFilled()) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Every fields must be filled.', life: 3000 });
    } 
    if (!isCorrectPassword()) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: wrongPasswordErrorMessage, life: 5000 })
    } else if (repeatedPassword.value == signUpForm.value.password) {
      registerStep.value += 1;
    } 
  } else {
    registerStep.value += 1;
  }
}

const previousRegisterFormStep = () => {
  registerStep.value -= 1;
}

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

* {
  box-sizing: border-box;
}

body {
  background: #f6f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
  height: 100vh;
  margin: 0;
}

h1 {
  font-weight: bold;
  margin: 0;
  margin-bottom: 5px;
}

.sing-in-title {
  margin-bottom: 18px;
}

h2 {
  text-align: center;
}

p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

span {
  font-size: 12px;
}

a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

button {
  border-radius: 20px;
  border: 1px solid #FF4B2B;
  background-color: #FF4B2B;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

button:hover {
  border: 1px solid #FF4B2B;
  background-color: #FFFFFF;
  color: #FF4B2B;
  transform: scale(1.05);
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background-color: transparent;
  border-color: #FFFFFF;
}

button.ghost:hover {
  background-color: #FFFFFF;
  border-color: transparent;
  color: FF4B2B;
  transform: scale(1.05);
}

form {
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

.error-message {
  color: red !important;
  margin-top: 0px !important;
  margin-bottom: 2px;
  text-align: left !important;
}

/* input {
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
} */

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 
      0 10px 10px rgba(0,0,0,0.22);
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 930px; 
  min-height: 600px;
  position: absolute; 
  top: 47%;
  left: 50%;
  transform: translate(-50%, -50%); 
}


.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container{
  transform: translateX(-100%);
}

.overlay {
  background: #FF416C;
  background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);
  background: linear-gradient(to right, #FF4B2B, #FF416C);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #FFFFFF;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #DDDDDD;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

footer {
  background-color: #222;
  color: #fff;
  font-size: 14px;
  bottom: 0;
  position: fixed;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 999;
}

footer p {
  margin: 10px 0;
}

footer i {
  color: red;
}

footer a {
  color: #3c97bf;
  text-decoration: none;
}

.customNextStepButton {
  color: #FFFFFF;
  margin-top: 10px;
  background-color: #FF4B2B;
  border: 1px solid #FF4B2B;
  padding: 8px;
  border-radius: 20px;
  margin-left: 206px;
}

.customNextStepButton:hover {
  color: #FF4B2B;
  background-color: #FFFFFF;
  border: 1px solid #FF4B2B;
  transform: scale(1.07);
}

.fixed-size-textarea {
  resize: none;
  width: 360px;
  height: 180px; 
  background-color: #eee;
  border: none;
  margin: 10px;
}

.customSignUpButton {
  margin-left: 180px;
}

.button-container {
  display: flex;
  align-items: center; /* Alinear verticalmente al centro */
}

.customPreviousStepButton {
  color: #FFFFFF;
  margin-top: 10px;
  background-color: #FF4B2B;
  border: 1px solid #FF4B2B;
  padding: 8px;
  border-radius: 20px;
  margin-right: 0;
}

.customPreviousStepButton:hover {
  color: #FF4B2B;
  background-color: #FFFFFF;
  border: 1px solid #FF4B2B;
  transform: scale(1.07);
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

.customAvatar:hover {
  transform: scale(1.1);
}

.licenseCheckBox {
  margin-top: 4px;
  margin-bottom: 4px;
  text-align: left;
  margin-left: 6px;
}

.licenseCheckBox a {
  color: #FF4B2B;
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
  cursor: crosshair;
  width: 300px;
  opacity: 1;
  filter: contrast(120%);
}

.p-dialog-content {
  background-color: red;
  color: red;
}

</style>