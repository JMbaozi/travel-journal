import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Travel Journal' },
  },
  {
    path: '/trip/:id',
    name: 'trip',
    component: () => import('@/pages/TripDetailPage.vue'),
    props: (route) => ({ tripId: route.params.id }),
    meta: { title: 'Trip' },
  },
  {
    path: '/trip/:id/day/new',
    name: 'day-new',
    component: () => import('@/pages/DayEditorPage.vue'),
    props: (route) => ({ tripId: route.params.id }),
    meta: { title: 'New Day Entry' },
  },
  {
    path: '/trip/:id/day/:dayId',
    name: 'day-edit',
    component: () => import('@/pages/DayEditorPage.vue'),
    props: (route) => ({ tripId: route.params.id, dayId: route.params.dayId }),
    meta: { title: 'Edit Day Entry' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/SettingsPage.vue'),
    meta: { title: 'Settings' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title} | 旅游手帐`
})

export default router
