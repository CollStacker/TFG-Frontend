import { createI18n } from 'vue-i18n'

//* Translation messages
const messages = {
  en: {
    welcome: 'Welcome',
    goodbye: 'Goodbye',
    
  },
  es: {
    welcome: 'Bienvenido',
    goodbye: 'Adiós',
    
  }
}

//? i18n Instance
const i18n = createI18n({
  locale: 'en', //* Default language
  fallbackLocale: 'en', //* Background language
  messages, //* Translation messages
})

export default i18n