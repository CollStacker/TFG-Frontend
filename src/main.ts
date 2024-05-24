import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'

import { i18n } from './plugins/i18n';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue);
app.use(ToastService)

app.use(i18n)

app.mount('#app')
