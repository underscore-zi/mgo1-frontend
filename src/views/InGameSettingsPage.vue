<template>
  <ion-page>
    <CommonHeader :title="title" />
    <ion-content v-if="isReady">
      <GameSettingsCard :user_id="user.id" :editable="true" :fkeys="true"/>
    </ion-content>
  </ion-page>
</template>

<script setup allowJs="true">
import CommonHeader from '../components/CommonHeader.vue'
import GameSettingsCard from '../components/GameSettingsCard.vue'
import { useAsyncState } from '@vueuse/core'
import { IonPage, IonContent } from '@ionic/vue'
import { whoAmI } from '../mgo1/api.js'
import { computed } from 'vue'

const { state: user, isReady: userReady } = useAsyncState(async ()=>{
    const u = await whoAmI()
    return u.user
})

const title = computed(() => {
  if(!userReady || !user.value) return `In-game Settings`
  else {
    return `In-game Settings (${user.value.display_name})`
  }
})

import { addLoader } from '@/loader.js'
const isReady = computed(() => {
  return userReady.value
})
addLoader("Loading Settings...", [isReady])
</script>