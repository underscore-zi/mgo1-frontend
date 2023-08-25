<template>
    <ion-card v-if="games">
      <ion-toolbar class="ion-padding-start" color="dark">
          <ion-card-title>Recent Games</ion-card-title>
      </ion-toolbar>
      <ion-card-content class="ion-padding">
        <ion-grid>
            <ion-row class="table-header">
                <ion-col size="5">Game Name</ion-col>
                <ion-col size="1">Points</ion-col>
                <ion-col size="1">Kills</ion-col>
                <ion-col size="1">Deaths</ion-col>
                <ion-col size="2">Play Time</ion-col>
                <ion-col size="2"></ion-col>
            </ion-row>
            <ion-row v-for="g in recentGames" v-bind:key="g.id">
                <ion-col size="5">
                    <router-link :to="`/games/${g.game_id}`">
                    <ion-icon v-if="g.game_has_password" :icon="lockClosed"></ion-icon> {{ g.game_name }}
                    </router-link>
                </ion-col>
                <ion-col size="1">{{  g.points }}</ion-col>
                <ion-col size="1">{{  g.kills }}</ion-col>
                <ion-col size="1">{{  g.deaths }}</ion-col>
                <ion-col size="2"> {{  getDurationInGame(g) }} </ion-col>
                <ion-col size="2"> {{ timeSince(new Date(Date.parse(g.created_at))) }}</ion-col>
            </ion-row>

            <ion-row v-if="hasMoreGames">
              <ion-col size="12" class="ion-text-center">
                <router-link :to="`/users/${props.id}/games/1`">More Games</router-link>
              </ion-col>
            </ion-row>
        </ion-grid>
      </ion-card-content>
    </ion-card>
  </template>
  <script setup allowJs="true">
  import { computed, watch } from 'vue'
  import { useAsyncState } from '@vueuse/core'
  import { getUserGames } from '../mgo1/api.js'
  import { duration, timeSince } from '../mgo1/strings.js'
  import { IonIcon, IonCard, IonCardContent, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/vue';
  import { lockClosed } from 'ionicons/icons';
  
  const props = defineProps({id: String,})
  watch(() => props.id, () => {executeGames()})
  
  const { state: games, isReady: gamesReady, execute:executeGames} = useAsyncState(()=>{
      return getUserGames(props.id)
  })
  
  

  function getDurationInGame(game) {
    let delta;
    if(game.deleted_at.indexOf("0001") === -1) {
        delta = new Date(Date.parse(game.deleted_at)) - new Date(Date.parse(game.created_at))
    } else {
        delta = new Date() - new Date(Date.parse(game.created_at))
    }

    return duration(delta)
  }

  const hasMoreGames = computed(()=>{
    if(gamesReady.value === true) {
        return games.value.length > 10
    }
    return false
  })
  const recentGames = computed(() => {
    if(gamesReady.value === true) {
        return games.value.slice(0, 10)
    }
    return []
  })
  
  </script>
  
  <style scoped>
  .table-header {
    font-weight: bolder;
  }
  </style>