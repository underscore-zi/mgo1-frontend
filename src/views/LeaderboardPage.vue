<template>
  <ion-page>
    <CommonHeader :title="title" />
    <ion-content  :fullscreen="true" v-if="isReady">
      <ion-grid>
          <ion-card>
            <ion-toolbar color="dark" class="ion-padding-start">
              Rankings
              <span class="ion-padding-end" slot="end">
                <ion-toggle class="ion-padding-end" v-model="periodToggle">All-Time</ion-toggle>Weekly
              </span>
            </ion-toolbar>

            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-grid>
                      <ion-row class="ion-hide-md-up">
                        <ion-radio-group  v-model="mode">
                          <ion-radio class="ion-margin" label-placement="end"  v-for="v,k in modes" v-bind:key="k" :value="k">{{ v }}</ion-radio>
                          </ion-radio-group>
                      </ion-row>
                      <ion-row class="table-header">
                        <ion-col size="2">Rank</ion-col>
                        <ion-col>Display Name</ion-col>
                        <ion-col size="2">Points</ion-col>
                      </ion-row>
                      <ion-row v-for="entry in rankings" v-bind:key="entry.user_id">
                        <ion-col size="2">{{ entry.rank }}</ion-col>
                        <ion-col><router-link :to="`/users/${entry.user_id}`">{{ entry.display_name }}</router-link></ion-col>
                        <ion-col size="2" >{{ entry.points }}</ion-col>
                      </ion-row>
                      <ion-row>
                        <ion-col size="12" class="ion-text-center">
                          <ion-button v-if="page>1" @click="page--" fill="clear"><ion-icon :icon="arrowBack"></ion-icon></ion-button>
                          <ion-button v-if="rankings.length >= limit" @click="page++" fill="clear"><ion-icon :icon="arrowForward"></ion-icon></ion-button>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </ion-col>
                  <ion-col size="auto" class="ion-hide-md-down">
                    <ion-grid>
                      <ion-radio-group  v-model="mode">
                        <ion-row v-for="v,k in modes" v-bind:key="k">
                          <ion-radio class="ion-margin" label-placement="end" :value="k">{{ v }}</ion-radio>
                        </ion-row>
                      </ion-radio-group>
                    </ion-grid>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script setup allowJs="true">
const limit = 50 // should match server as its how it can detect when there are no more pages
import { useAsyncState } from '@vueuse/core'
import { getLeaderboard } from '../mgo1/api.js'
import { useRoute, useRouter } from 'vue-router'
import { IonRadio, IonRadioGroup, IonToggle, IonPage } from '@ionic/vue';
import { computed, ref, watch } from 'vue'
import { arrowForward, arrowBack } from 'ionicons/icons';
import  CommonHeader from '../components/CommonHeader.vue'
const route = useRoute()
const router = useRouter()
const title = computed(()=>{ return `Leaderboard - ${periodToggle.value?'Weekly':'All-Time'} - ${modes[mode.value]}` })

const mode = ref(route.params.mode?route.params.mode:'all')
const page = ref(route.params.page?route.params.page:1)

const periodToggle = ref(false)
if(route.params.period && route.params.period == 'weekly') { periodToggle.value = true } 
const period = computed(()=>{
  if(periodToggle.value) { return 'weekly' }
  return 'all-time'

})

const { state: rankings, isReady: rankingsReady, execute:executeRanking } = useAsyncState(()=>{
  return getLeaderboard(period.value, mode.value, page.value)
})

const isReady = computed(()=>{ return rankingsReady.value })

import { onIonViewWillEnter } from '@ionic/vue'
onIonViewWillEnter(async () => {
  executeRanking()
})

const modes = {
  "all": "All Modes",
  "dm": "Deathmatch",
  "tdm": "Team Deathmatch",
  "cap": "Capture",
  "res": "Rescue",
  "sne": "Sneaking",
}


watch([mode, period, page], ([newMode, newPeriod, newPage]) => {
  router.replace({name: 'leaderboard', params: {mode: newMode, period: newPeriod, page: newPage}, direction:"forward" })
})

//import { addLoader } from '@/loader.js'
//addLoader("Loading Leadboard...", [isReady])
</script>

<style scoped>
.table-header>ion-col {
  font-weight: bold;
  font-size:110%;
}
</style>