<template>
    <ion-page>
      <CommonHeader :title="title" />
      <ion-content v-if="gamesReady && userReady">
        <OverviewCard :user_id="Number(route.params.id)" :user="user" />
        <ion-card>
          <ion-toolbar color="dark" class="ion-padding-start title">
            <ion-card-title>Games</ion-card-title>
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
                  <ion-row v-for="g in games" v-bind:key="g.id">
                    
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
                  <ion-row>
                    <ion-col size="12" class="ion-text-center">
                      <ion-button v-if="showPrev" @click="page--" fill="clear"><ion-icon :icon="arrowBack"></ion-icon></ion-button>
                      <ion-button v-if="showNext" @click="page++" fill="clear"><ion-icon :icon="arrowForward"></ion-icon></ion-button>
                    </ion-col>
                  </ion-row>
              </ion-grid>

            </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-page>
</template>

<script setup allowJs="true">
import CommonHeader from '@/components/CommonHeader.vue'
import OverviewCard from '@/components/OverviewCard.vue'
import { useAsyncState } from '@vueuse/core'
import {ref, computed, watch} from 'vue'
import { IonPage, IonContent } from '@ionic/vue';
import { useRoute } from 'vue-router'
import { getUserGames, getUserSummary } from '../mgo1/api.js'
import { duration, timeSince } from '../mgo1/strings.js'
import { lockClosed, arrowBack, arrowForward } from 'ionicons/icons';
import { useRouter } from 'vue-router'
const limit = 50 // should match the server-side value to detect when there are no more pages
const route = useRoute()
const router = useRouter()
const page = ref(Number(route.params.page) || 1)


const { state: games, isReady: gamesReady } = useAsyncState(()=>{
    return getUserGames(route.params.id, route.params.page)
})

const { state: user, isReady: userReady } = useAsyncState(()=>{
    return getUserSummary(route.params.id)
})

const title = computed(()=>{
    if(!userReady || user.value === undefined) {
      return "Loading Games..."
    } else {
      return `${user.value.name}'s Games (Page ${route.params.page})`
    } 
})

const showPrev = computed(() => {
  if(gamesReady) return route.params.page > 1
  return false
})

const showNext = computed(() => {
  if(gamesReady && games.value != null) return games.value.length === limit
  return false
})


watch(page, (newVal) => {
  router.replace({name: 'user-games', params: {id: route.params.id, page: newVal}, direction:"root" })
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

import { addLoader } from '@/loader.js'
const isReady = computed(() => {
  return gamesReady.value && userReady.value
})
addLoader("Loading Games...", [isReady])
</script>