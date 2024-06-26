import { defineStore } from 'pinia';
import { API_URI } from '@/types/env';
import { type UserInterface } from '../types/user';

export const userAuthentication = defineStore({
  id: 'authentication',
  state: () => ({
    userAuthenticated: false,
    token: "",
    id: "",
    username: "", 
    email: "", 
    name: "",
    surnames: "",
    profilePhoto: "",
    biography: "",
    loginError: false,

    // friends
    friends: [],
    // INFORMATION WHEN FINDING A USER
    userFound: false,
    user: {
      id: "",
      username: "",
      email: "",
      name: "",
      surnames: "",
      profilePhoto: "",
      biography: "",
    },
  }),
  actions: {
    getAuthentication(): boolean {
      return this.userAuthenticated;
    }, 
    getToken(): string {
      return this.token;
    },
    clearStore() {
      this.userAuthenticated = false;
      this.token = "";
      this.id = "";
      this.username = ""; 
      this.email = ""; 
      this.name = "";
      this.surnames = "";
      this.profilePhoto = "";
      this.biography = "";
      
      this.friends = []
    },
    setUserData(userData: { biography: string, email: string, id: string,name: string, profilePhoto: string,surnames: string, username: string}) {
      this.id = userData.id;
      this.username = userData.username; 
      this.email = userData.email; 
      this.name = userData.name;
      this.surnames = userData.surnames;
      this.profilePhoto = userData.profilePhoto;
      this.biography = userData.biography;
    },
    setUserDataLoginWithGoogle(userData: { biography: string, email: string, id: string,name: string, profilePhoto: string,surnames: string, username: string, token: string}) {
      this.id = userData.id;
      this.username = userData.username; 
      this.email = userData.email; 
      this.name = userData.name;
      this.surnames = userData.surnames;
      this.profilePhoto = userData.profilePhoto;
      this.biography = userData.biography;
      this.token = userData.token;
    },
    getUserData() {
      return {
        id: this.id,
        email: this.email,
        username: this.username,
        name: this.name,
        surnames: this.surnames,
        profilePhoto: this.profilePhoto,
        biography: this.biography
      }
    },
    async login(credentials: {email: string, password: string}) {
      const response = await fetch(API_URI+`/users/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      })
      if(!response.ok) {
        return "Error";
      } else {
        const data = await response.json();
        const token = data.token; 
        this.token = token;
        this.userAuthenticated = true;
        const userData = await fetch(API_URI + `/userData/${credentials.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
        if (!userData.ok) {
          return "Error"
        }
        const userDataJSON = await userData.json();
        this.setUserData(userDataJSON);
        this.findFriends();
        return "Succes";
      }
    },
    async loginWithGoogle() {
      window.location.href = API_URI + `/auth/google`;
      const response = await fetch(API_URI + `/auth/google`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log(response);
      if(!response.ok) {
        return "Error"
      } else {
        console.log(await response.json())
        return "Succes"
      }
    },
    async checkToken() {
      if(this.token !== "") {
        const response = await fetch(API_URI + `/whoAmI`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
        })
        if (response.ok) {
          return true;
        }
      }
      return false;
    },
    setFoundedUserData(foundedUser: UserInterface) {
      this.userFound = true;
      this.user.id = foundedUser.id;
      this.user.biography = foundedUser.biography; 
      this.user.name = foundedUser.name; 
      this.user.username = foundedUser.username; 
      this.user.surnames = foundedUser.surnames; 
      this.user.profilePhoto = foundedUser.profilePhoto; 
      this.user.email = foundedUser.email;
    },
    getFoundedUserData() {
      return this.user;
    },
    async findFriends() {
      const response = await fetch(API_URI + `/getFriends/${this.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
      })
      console.log(response)
      console.log(response.json)
      if(response.ok) {
        this.friends = await response.json();
      }
    },
    getFriends ():string[] {
      return this.friends;
    }
  },
})