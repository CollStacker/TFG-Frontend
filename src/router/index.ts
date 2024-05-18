import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homeView',
      component: HomeView
    },
    {
      path: '/main',
      name: 'mainPage',
      component: () => import('../views/Overview.vue')
    },
    {
      path: '/userProfile',
      name: 'userProfile',
      component: () => import('../views/UserProfile.vue')
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/Collections.vue')
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import('../views/Messages.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue')
    },
    {
      path: '/legalNotice',
      name: 'legalNotice',
      component: () => import('../views/LegalNotice.vue')
    },
    {
      path: '/privacyPolicities',
      name: 'privacyPolicities',
      component: () => import('../views/PrivacyPolicies.vue')
    },
    {
      path: '/collectionForm',
      name: 'collectionForm',
      component: () => import('../views/CollectionForm.vue')
    },
    {
      path: '/productForm',
      name: 'productForm',
      component: () => import('../views/ProductForm.vue')
    },
    {
      path: '/userFounded',
      name: 'userFounded',
      component: () => import('../views/UserFounded.vue')
    },
  ]
})

export default router
