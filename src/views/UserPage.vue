<template>
  <ion-page>
    <CommonHeader :title="title" />
    <ion-content v-if="isReady">
      <OverviewCard :user_id="user.id" :user="user" />
      <UserGamesCard :id="user.id" />
      <StatsCard :id="user.id" :overall_rank="user.overallRank" :weekly_rank="user.weeklyRank" />
      <GameSettingsCard :user_id="user.id" :editable="false"/>
    </ion-content>
  </ion-page>
</template>

<script setup allowJs="true">
import { computed } from 'vue'
import { useAsyncState } from '@vueuse/core'
import CommonHeader from '../components/CommonHeader.vue'
import StatsCard from '../components/StatsCard.vue'
import UserGamesCard from '../components/UserGamesCard.vue'
import OverviewCard from '../components/OverviewCard.vue'
import GameSettingsCard from '../components/GameSettingsCard.vue'
import { getUserSummary } from '@/mgo1/api.js'
import { useRoute } from 'vue-router'
import { IonPage, IonContent } from '@ionic/vue';

const route = useRoute()
const { state: user, isReady: userReady } = useAsyncState(()=>{
    return getUserSummary(route.params.id)
})

const title = computed(() => {
    if(userReady.value === true) {
        return user.value.name
    }
    return "Loading User..."
})

import { addLoader } from '@/loader.js'
const isReady = computed(() => {
  return userReady.value
})
addLoader("Loading User...", [isReady])

</script>

<style scoped>

</style>
