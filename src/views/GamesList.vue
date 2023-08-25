<template>
  <ion-page>
    <CommonHeader title="Games List" />
    <ion-content  :fullscreen="true" v-if="isReady">
      <ion-row class="ion-padding">
        <ion-col class="ion-text-center" v-if="connectionCount == 0">There are currently <span class="player-count">NO</span> players connected.</ion-col>
        <ion-col class="ion-text-center" v-else-if="connectionCount == 1">There is currently <span class="player-count">1</span> player connected.</ion-col>
        <ion-col class="ion-text-center" v-else>There are currently <span class="player-count">{{connectionCount}}</span> players connected.</ion-col>
      </ion-row>
      <ion-card v-for="game in games" v-bind:key="game.id">
        <ion-toolbar color="dark">
          <ion-grid>
            <ion-row>
              <ion-col size="10" class="ion-text-left">{{ game.name }}</ion-col>
              <ion-col size="2" class="ion-text-right">{{  game.playerCount }} / {{ game.maxPlayers }}</ion-col>
            </ion-row>
            <ion-row class="game-info">
              <ion-col v-if="game.isAlive">
                {{ game.currentRules.mode }} - {{ game.currentRules.map }}
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-col size="auto" slot="start" class="ion-padding-start">
            <ion-icon :icon="game.isLocked ? lockClosed : ''"></ion-icon>
          </ion-col>
          <ion-button  fill="clear" slot="end" :router-link="`/games/${game.id}`" router-direction="forward" >
            <ion-icon size="large" color="success" :icon="chevronForward"/>
          </ion-button>
        </ion-toolbar>
      </ion-card>
      <ion-card v-if="games.length == 0">
        <ion-toolbar color="dark" class="ion-padding-start">No Games</ion-toolbar>
      </ion-card>      
    </ion-content>
  </ion-page>
</template>
  
<script setup allowJs="true">
import { useAsyncState } from '@vueuse/core'
import { getGames, getLobbies } from '../mgo1/api.js'
import { IonButton, IonContent, IonPage, IonToolbar } from '@ionic/vue';
import { lockClosed, chevronForward } from 'ionicons/icons';
import CommonHeader from '../components/CommonHeader.vue'
const { state: lobbies,  isReady: lobbiesReady } = useAsyncState(()=> {
  return getLobbies()
})

const { state: games, isReady: gamesReady } = useAsyncState(()=>{
  return getGames()
})

const connectionCount = computed(()=>{
  if(lobbies.value) {
    return lobbies.value.reduce((acc, cur) => acc + cur.players, 0)
  }
  return 0
})

import { computed } from 'vue'
import { addLoader } from '@/loader.js'
const isReady = computed(() => {
  return gamesReady.value && lobbiesReady.value
})
addLoader("Loading Games...", [isReady])

</script>

<style scoped>
#container {
text-align: center;
position: absolute;
left: 0;
right: 0;
top: 50%;
transform: translateY(-50%);
}

#container strong {
font-size: 20px;
line-height: 26px;
}

#container p {
font-size: 16px;
line-height: 22px;
color: #8c8c8c;
margin: 0;
}

#container a {
text-decoration: none;
}

.game-info {
  font-size:90%;
  text-transform: capitalize;
}

.player-count {
  font-weight: bold;
  font-size: 150%;
}
</style>
