import { createRouter, createWebHistory } from 'vue-router'
import LibraryView from '../Views/Library.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/', component: LibraryView }],
})

export default router
