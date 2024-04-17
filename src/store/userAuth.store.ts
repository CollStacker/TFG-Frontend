import { defineStore } from 'pinia';
import { API_URI } from '@/types/env';

export const userAuthentication = defineStore({
  id: 'authentication',
  state: () => ({
    userAuthenticated: false,
    token: "",
    _id: "",
    username: "", 
    email: "", 
    name: "",
    surnames: "",
    profilePhoto: "",
    biography: "",
    loginError: false
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
      this._id = "";
      this.username = ""; 
      this.email = ""; 
      this.name = "";
      this.surnames = "";
      this.profilePhoto = "";
      this.biography = "";
      this.loginError = false;
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
        this.loginError = true;
        return "Error"
      } else {
        const data = await response.json();
        const token = data.token; 
        this.token = token;
        this.userAuthenticated = true;
        return "Succes"
      }
    } 
  },
})