import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    name: 'home',
    path: '',
    component: () => import ('@/views/NewsPage.vue')
  },
  {
    path: '/games/:id',
    component: () => import ('@/views/GamesSingle.vue')
  },
  {
    path: '/games/',
    component: () => import ('@/views/GamesList.vue')
  },
  {
    path: '/leaderboard/',
    component: () => import ('@/views/LeaderboardPage.vue')
  },
  {
    path: '/leaderboard/:period/',
    component: () => import ('@/views/LeaderboardPage.vue')
  },
  {
    path: '/leaderboard/:period/:mode/',
    component: () => import ('@/views/LeaderboardPage.vue')
  },
  {
    name: 'leaderboard',
    path: '/leaderboard/:period/:mode:/:page',
    component: () => import ('@/views/LeaderboardPage.vue')
  },

  {
    name: 'user-games',
    path: '/users/:id/games/:page',
    component: () => import ('@/views/PlayerGamesList.vue')
  },
  {
    name: 'user',
    path: '/users/:id',
    component: () => import ('@/views/UserPage.vue')
  },
  {
    name: 'search-player',
    path: '/search/:name/:page',
    component: () => import ('@/views/SearchPlayerPage.vue')
  },
  {
    name: 'login',
    path: '/login',
    component: () => import ('@/views/LoginPage.vue')
  },
  {
    name: 'logout',
    path: '/logout',
    component: () => import ('@/views/LogoutPage.vue')
  },
  { 
    name: 'ban-list',
    path: '/admin/bans',
    component: () => import ('@/views/admin/BanList.vue')
  },
  {
    name: 'manage-roles',
    path: '/admin/roles',
    component: () => import ('@/views/admin/ManageRoles.vue')
  },
  {
    name: 'manage-users',
    path: '/admin/users',
    component: () => import ('@/views/admin/ManageUsers.vue')
  },
  {
    name: 'admin-search-player',
    path: '/admin/search/name/:name/:page',
    component: () => import ('@/views/admin/SearchPlayerPage.vue')
  },
  {
    name: 'search-ip',
    path: '/admin/search/ip/:ip/:page',
    component: () => import ('@/views/admin/SearchIP.vue')
  },
  {
    name: 'manage-player',
    path: '/admin/player/:user_id',
    component: () => import ('@/views/admin/ManagePlayer.vue')
  },
  {
    name: 'account',
    path: '/account',
    component: () => import ('@/views/MyAccount.vue')
  },
  {
    name: 'settings',
    path: '/settings',
    component: () => import ('@/views/InGameSettingsPage.vue')
  },
  {
    name: 'manage-news',
    path: '/admin/news',
    component: () => import ('@/views/admin/ManageNews.vue')
  },
  {
    name: 'manage-policy',
    path: '/admin/policy',
    component: () => import ('@/views/admin/ManagePolicy.vue')
  },
  {
    name: 'guides',
    path: '/guides',
    component: () => import ('@/views/GuidesPage.vue')
  },
  {
    name: 'cheats',
    path: '/cheats',
    component: () => import ('@/views/CheatsPage.vue')
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
