import { createRouter, createWebHistory } from 'vue-router'
const UserView = () => import('../views/UserView.vue')
const PageNotFound = () => import('../views/PageNotFound.vue')
const PrivacyPageView = () => import('../views/PrivacyPageView.vue')
const HomepageView = () => import('../views/HomepageView.vue')
const CategoryView = () => import('../views/CategoryView.vue')
const SearchPageView = () => import('../views/SearchPageView.vue')
const VodView = () => import('../views/VodView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const ClipView = () => import('../views/ClipView.vue')
const FollowingView = () => import('../views/FollowingView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomepageView
    },
    {
      path: '/directory',
      component: HomepageView
    },
    {
      path: '/search',
      component: SearchPageView
    },
    {
      path: '/directory/game/:game',
      component: CategoryView
    },
    // Issue #95
    {
      path: '/directory/category/:game',
      component: CategoryView
    },
    {
      path: '/privacy',
      name: 'about',
      component: PrivacyPageView
    },
    {
      path: '/following',
      component: FollowingView
    },
    {
      path: '/:username',
      component: UserView
    },
    {
      path: '/settings',
      component: SettingsView
    },
    {
      path: '/videos/:vodID',
      component: VodView
    },
    {
      path: '/clip/:slug',
      component: ClipView
    },
    // suppotrt other clip method
    {
      path: '/:streamerName/clip/:slug',
      component: ClipView
    },
    { path: '/:pathMatch(.*)*', component: PageNotFound }
  ]
})

export default router
