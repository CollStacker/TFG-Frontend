import { createI18n } from "vue-i18n";
import messages from '@intlify/unplugin-vue-i18n/messages'

export const i18n = createI18n({
  legacy: false, //* To composition Api, if we'll have <script setup> must have prop legacy on false
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en', // If by default English does not load
  availableLocales: ['en','es'],
  messages: messages
})
