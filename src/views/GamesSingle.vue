<template>
  <ion-page>
    <CommonHeader :title="title" />
    <ion-content :fullscreen="true" v-if="isReady">
      <div id="container">
        <ion-card>
          <ion-toolbar color="dark">
            <ion-grid class="ion-margin">
              <ion-row class="title">{{ game.name }}</ion-row>
              <ion-row class="game-subtitle" v-if="game.isAlive">{{ game.currentRules.mode }} - {{ game.currentRules.map }}</ion-row>
            </ion-grid>
          </ion-toolbar>
          <ion-card-content>
            <ion-grid>
              <ion-row v-if="game.description">{{ game.description }} </ion-row>
              <ion-row v-else><em>No Description</em></ion-row>
            </ion-grid>
          </ion-card-content>
          <ion-footer class="ion-margin">
            <ion-grid>
              <ion-row v-if="game.isAlive">Created {{ timeSince(game.createdAt) }}</ion-row>
              <ion-row v-else>Game Closed {{ timeSince(game.deletedAt) }}</ion-row>
            </ion-grid> 
          </ion-footer>
        </ion-card>

        <ion-card>
          <ion-toolbar color="dark">
            <ion-grid slot="start" class="title ion-margin">Players</ion-grid>
            <ion-grid slot="end" class="ion-margin" v-if="game.isAlive">
              {{ game.playerCount }} / {{ game.maxPlayers }}
            </ion-grid>
          </ion-toolbar>
          <ion-card-content>
              <ion-grid>
              <ion-row>
                <ion-col>Show Disconnected Players<ion-toggle class="ion-margin-start" v-model="showDisconnected"></ion-toggle></ion-col>
              </ion-row>
              <ion-row class="table-header">
                <ion-col size="4">Display Name</ion-col>
                <ion-col size="2">Kills</ion-col>
                <ion-col size="2">Deaths</ion-col>
                <ion-col size="2">Points</ion-col>
                <ion-col size="2">Play Time</ion-col>
              </ion-row>
              <ion-row v-for="player in playerList" v-bind:key="player.createdAt" :class="getClassForPlayer(game, player)">
                <ion-col size="4">
                  <router-link :to="`/users/${player.id}`">{{ player.name }}</router-link>
                </ion-col>
                <ion-col size="2">{{ player.kills }}</ion-col>
                <ion-col size="2">{{ player.deaths }}</ion-col>
                <ion-col size="2">{{ player.score }}</ion-col>
                <ion-col size="2">{{ duration(player.duration) }}</ion-col>
                <ion-col></ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
          <ion-footer class="ion-margin" color="dark">
            <ion-grid>Last Updated {{ timeSince(lastUpdated) }}</ion-grid>
          </ion-footer>
        </ion-card>

        <ion-card>
          <ion-toolbar color="dark">
            <ion-grid slot="start" class="title ion-margin">Rules</ion-grid>
          </ion-toolbar>
          <ion-card-content>
              
                <ion-row v-for="rule,i in game.rules" v-bind:key="i" :class="(game.currentRound == i)?'highlight-row':''">
                  <ion-col size="1">
                    <ion-icon :icon="flashSharp" v-if="game.currentRound == i && game.isAlive"></ion-icon>
                  </ion-col>
                  <ion-col class="ion-text-capitalize">
                    {{ rule.mode }}
                  </ion-col>
                  <ion-col class="ion-text-capitalize">
                    {{ rule.map }}
                  </ion-col>
                </ion-row>
            
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
    <ion content   v-else>
      <div id="container">
        [[ Loading ]]
      </div>
    </ion>
  </ion-page>
</template>
  
<script setup allowJs="true">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAsyncState } from '@vueuse/core'
import { getGame } from '../mgo1/api.js'
import { timeSince, duration } from '../mgo1/strings.js'
import { IonPage, IonContent, IonToolbar, IonToggle, IonFooter } from '@ionic/vue';
import { flashSharp } from 'ionicons/icons';
import CommonHeader from '../components/CommonHeader.vue'

const route = useRoute()
const showDisconnected = ref(false)

const playerList = computed(() => {
  if(gameReady.value === true) {
    return game.value.players.filter(e=>e.isAlive || showDisconnected.value)
  }
  return []
})

const lastUpdated = computed(() => {
  if(gameReady.value === true) {
    let lastUpdated = null
    game.value.players.forEach(e=>{
      if(lastUpdated === null || e.updatedAt > lastUpdated) {
        lastUpdated = e.updatedAt
      }
    })
    return lastUpdated
  }
  return null
})


const { state: game, isReady: gameReady } = useAsyncState(()=>{
  return getGame(route.params.id)
})

const title = computed(() => {
  if(gameReady.value === true) {
    return game.value.name
  }
  return `Loading Game...`
})

function getClassForPlayer(game, player) {
  const classes = []
  if(player.isAlive) { 
    classes.push("team-badge")
    classes.push('player-connected') 
    if(game.isHostOnly && game.host.id == player.id) { classes.push('team-host-only') }
    else {
      switch(player.team) {
        case "Red": classes.push('team-red'); break;
        case "Blue": classes.push('team-blue'); break;
        case "Spectator": classes.push('team-spectator'); break;
      }
    }
  } else { 
    if(game.isAlive) { classes.push('player-disconnected') }
    if(player.wasKicked) { classes.push('player-kicked') }
  }
  return classes.join(' ')
}

import { addLoader } from '@/loader.js'
const isReady = computed(() => {
  return gameReady.value
})
addLoader("Loading Game...", [isReady])
</script>

<style scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}
.subtitle {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}

.table-header {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}

.player-disconnected {
  opacity: 0.4;
}
.player-disconnected>ion-col:first-of-type {
  text-decoration: line-through;
}


.highlight-row {
  background-color: var(--ion-color-dark-shade);
}

.game-subtitle {
  font-style: italic;
  text-transform: capitalize;
  font-size: 90%
}
.team-spectator>ion-col:first-of-type:before {
  color: rgb(255,255,255);
  content: "SPEC";  
}
.team-host-only>ion-col:first-of-type:before {
  color: rgb(255,255,255);
  content: "HOST ONLY";  
}

.team-red>ion-col:first-of-type:before {
  color: rgb(255,0,0);
  content: "RED";  
}
.team-blue>ion-col:first-of-type:before {
  color: rgb(30,30,255);
  content: "BLUE";  
}


.team-badge>ion-col:first-of-type:before {
  text-align:center;
  vertical-align: middle;  
  font-size: 70%;
  font-weight: bold;
  padding: 3px;
  margin-right: 5px; 
}

.player-kicked>ion-col:first-of-type {
  text-decoration: line-through;
  text-decoration-thickness: 3px;
  text-decoration-color: red;  
}
</style>