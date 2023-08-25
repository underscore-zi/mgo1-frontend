<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list class="menu-list">
            <ion-list-header></ion-list-header>
            
            <ion-menu-toggle auto-hide="false">
              <ion-item v-for="(p, i) in appPages" :key="i" @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i, extra: i >= coreMenu.length}">
                <ion-icon aria-hidden="true" slot="start" :icon="p.icon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
              <ion-item href="https://discord.gg/mgo2pc">
                <ion-icon aria-hidden="true" slot="start" :icon="logoDiscord"></ion-icon>
                <ion-label>Join us on Discord</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        
          <ion-list id="search-list">
            <form @submit.prevent="submitIPSearch">
              <ion-item v-if="adminUser && adminUser.hasPrivilege('search_by_ip')">
                <ion-icon slot="start" :icon="gitNetworkOutline"></ion-icon>
                <ion-input v-model="searchIP" label="Find by IP" label-placement="floating"></ion-input>
              </ion-item>
            </form>

            <form @submit.prevent="submitSearch">
              <ion-item>
                <ion-icon slot="start" :ios="searchOutline" :md="searchOutline"></ion-icon>
                <ion-input v-model="searchUsername" label="Find Player" label-placement="floating"></ion-input>
              </ion-item>
            </form> 
          
            <ion-item v-if="gameUser || adminUser" router-direction="root" router-link="/logout" lines="none" detail="false" class="hydrated">
              <ion-icon aria-hidden="true" slot="start" :icon="logOut"></ion-icon>
              <ion-label>Logout</ion-label>
            </ion-item>
            <ion-item v-else router-direction="root" router-link="/login">
              <ion-icon aria-hidden="true" slot="start" :icon="logIn"></ion-icon>
              <ion-label>Login</ion-label>
            </ion-item>

          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet @login="login" id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup allowJs="true">
import emitter from 'tiny-emitter/instance'
import { AdminUser } from '@/mgo1/objects/admin-user.js'
import { User } from '@/mgo1/objects/user.js'
import { whoAmI } from './mgo1/api.js'
import { IonInput, IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonRouterOutlet, IonSplitPane, toastController} from '@ionic/vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logoDiscord, codeWorkingOutline, logIn, logOut, homeOutline, globeOutline, trophyOutline, cameraOutline, searchOutline, gitNetworkOutline, banOutline, checkboxOutline, peopleOutline, newspaperOutline, settingsOutline, personCircleOutline, documentOutline} from 'ionicons/icons';

const router = useRouter()
const searchUsername = ref("");
const searchIP = ref("")
const selectedIndex = ref(0);
const adminUser = ref(false);
const gameUser = ref(false)
const coreMenu = [
  { title: 'Home', url: '/', icon: homeOutline, },
  { title: 'Games', url: '/games/', icon: globeOutline },
  { title: 'Leaderboard', url: '/leaderboard/', icon: trophyOutline },
  { title: 'Guides', url: '/guides', icon: cameraOutline },
  { title: "Cheats", url: '/cheats', icon: codeWorkingOutline},
]

const gameUserMenu = [
  { title: 'My Account', url: '/account/', icon: personCircleOutline },
  { title: 'In-Game Settings', url: '/settings/', icon: settingsOutline },
]

const adminMenu = [
  { privilege:"manage_news", title: 'Manage News', url: '/admin/news/', icon: newspaperOutline},
  { privilege:"manage_policy", title: 'Update Policy', url: '/admin/policy/', icon: documentOutline},
  { privilege:"read_bans", title: 'Bans', url: '/admin/bans/', icon: banOutline },
  { privilege:"manage_users", title: 'Manage Admins', url: '/admin/users/', icon: peopleOutline },
  { privilege:"manage_users", title: 'Manage Roles', url: '/admin/roles/', icon: checkboxOutline },
]

function submitSearch() {
  router.replace({name: adminUser.value?'admin-search-player':'search-player', params: {name: searchUsername.value, page:1}, direction:"root" })
  searchUsername.value = ""
}

function submitIPSearch() {
  router.replace({name: 'search-ip', params: {ip: searchIP.value, page:1}, direction:"root" })
  searchIP.value = ""
}

const appPages = computed(()=>{
  const out = Object.create(coreMenu)
  if(gameUser.value !== false) {
    out.push(...gameUserMenu)
  }
  if(adminUser.value !== false) {
    for (const [,value] of Object.entries(adminMenu)) {
      if (adminUser.value.hasPrivilege(value.privilege)) {
        out.push(Object.create(value))
      }
    }
  }
  return out
})

emitter.on('login', function (loginType, results) {
  switch(loginType) {
    case "user":
      gameUser.value = new User(results)
      break;
    case "admin":
      adminUser.value = new AdminUser(results)
      break;
  }
});

emitter.on('logout', function() {
  gameUser.value = false
  adminUser.value = false
  router.push({name: 'home', direction:"forward" })
})

onMounted(async ()=>{
  const results = await whoAmI()
  if(results.user !== null) {
    emitter.emit('login', 'user', results.user)
  }
  if(results.admin_user !== 0) {
    emitter.emit('login', 'admin', results.admin_user)
  }
})

emitter.on("error", async function(e) {
  const toast = await toastController.create({
    message: e.message,
    duration: 15000,
    position: 'top',
    color: 'danger',
  });
  await toast.present();    
})
emitter.on("success", async function(msg) {
  const toast = await toastController.create({
    message: msg,
    duration: 15000,
    position: 'top',
    color: 'success',
  });
  await toast.present();    
})
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list.menu-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}



ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#search-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}

ion-menu {
  --side-width: 264px;
  --side-width-small: 264px;
}


ion-item {
  padding-top: 0px;
  --min-height: 20px !important;
  margin-bottom: 5px;
}

ion-item * {
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>

<style>
a {
  text-decoration: none;
  font-weight: bold;
}
</style>
