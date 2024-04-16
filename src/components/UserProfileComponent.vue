<template>
  <div class="userProfileComponentContainer">
    <div class="userProfileComponentColumn">
      <div class="userProfileComponentCard"> 
        <img class="cardImgTop" src="../assets/imgs/sidebar/sidebar.jpg" alt="Card image cap">
        <div class="cardBody littleProfile textCenter">
          <div class="proImg">
            <img v-if="userData.profilePhoto === 'maleYoung'"  src="../assets/imgs/profilePhoto/male-young.jpg"/>
            <img v-if="userData.profilePhoto === 'maleAdult'"  src="../assets/imgs/profilePhoto/male-adult.jpg"/>
            <img v-if="userData.profilePhoto === 'maleOld'"  src="../assets/imgs/profilePhoto/male-old.jpg"/>
            <img v-if="userData.profilePhoto === 'femaleOld'"  src="../assets/imgs/profilePhoto/female-old.jpg"/>
            <img v-if="userData.profilePhoto === 'femaleAdult'"  src="../assets/imgs/profilePhoto/female-adult.jpg"/>
            <img v-if="userData.profilePhoto === 'femaleYoung'"  src="../assets/imgs/profilePhoto/female-young.jpg"/>
          </div>
          <span class="usernameText" >{{userData.username}}</span>
          <div class="userDataContainer">
            <div class="userDataText">
              <span>Email</span>
              <div class="emailText">
                <InputText v-model="userData.email" disabled />
              </div>
            </div>
            <div class="userDataText">
              <span>Name</span>
              <div class="emailText">
                <InputText v-model="userData.name" disabled />
              </div>
            </div>
            <div class="userDataText">
              <span>Surnames</span>
              <div class="emailText">
                <InputText v-model="userData.surnames" disabled />
              </div>
            </div>
            <div class="userDataText">
              <span>Biography</span>
              <div class="emailText">
                <Textarea v-model="userData.biography" disabled autoResize />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { ref } from "vue";

const userData = ref({
  username: "Adrian01",
  email: "adrian@test.com",
  name: "Adrián",
  surnames: "González Expósito",
  profilePhoto: "maleOld",
  biography: "Hola soy Adrián, actualmente estudio ingenieria informatica. Me gsuta coleccionar coches antiguos"
})
</script>

<style>
  
  .userProfileComponentContainer {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    padding: 3rem;
    display: flex;
    justify-content: center; 
    align-items: center;
  }

  .userProfileComponentCard {
    border-radius: 4px;
    background-color: #ffffff;
    margin-bottom: 30px;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
  }

  .cardImgTop {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .cardBody {
    padding: 1.25rem;
  }

  
  .littleProfile .proImg img {
    width: 230px;
    margin-top: -160px;
    height: 230px;
    margin-bottom: 10px;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
  }

  .textCenter {
    text-align: center;
  }

  .userProfileComponentColumn {
    flex: 0 0 auto;
    width: 66.666667%;
  }

  @media (max-width: 991.98px) {
    .padding {
      margin-left: 0;
    }
  }

  .usernameText {
    font-family: 'Pacifico', cursive;
    font-size: 34px;
    color: #2c2c2c; 
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); 
  }

  .userDataContainer {
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos se envuelvan en varias filas */
  /* justify-content: flex-start;  */
  max-width: 600px; /* Ancho máximo del contenedor padre */
}

.userDataText {
  flex: 1 1 200px; /* Establece un tamaño flexible para los elementos, con un ancho mínimo de 200px */
  margin-right: 20px; /* Espacio entre cada columna */
  margin-bottom: 20px; /* Espacio entre cada fila */
}

.userDataText span {
  font-weight: bold;
}

.userDataText .emailText {
  margin-top: 5px; /* Espacio entre el texto y el campo de entrada */
}
</style>