import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { userAuthentication } from '@/store/userAuth.store';

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
    // {
    //   path: '/legalNotice',
    //   name: 'legalNotice',
    //   component: () => import('../views/LegalNotice.vue')
    // },
    // {
    //   path: '/privacyPolicities',
    //   name: 'privacyPolicities',
    //   component: () => import('../views/PrivacyPolicies.vue')
    // },
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

router.beforeEach((to, from, next) => {
  const params = new URLSearchParams(window.location.search);
  if (params.has('user')) {
    const user = JSON.parse(decodeURIComponent(params.get('user') as string));
    // console.log('User data:', user);

    const authStore = userAuthentication();
    authStore.setUserDataLoginWithGoogle(user);
    authStore.findFriends();

    // Limpia los parámetros de la URL
    window.history.replaceState({}, document.title, "/");

    // Redirige a la página principal
    next({ path: '/main' });
  }
  next();
});

export default router
