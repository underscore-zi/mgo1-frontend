<template>
    <ion-card class="ion-margin user-overview-card" v-if="userReady && user">
      <ion-toolbar color="dark" class="ion-padding-start title"><ion-card-title>{{ user.name }} <span v-if="user.hasEmblem">({{ user.emblem }})</span></ion-card-title></ion-toolbar>
      <ion-card-content :class="user.hasEmblem?'emblem':''">
          <ion-grid>
          <ion-row>
              <ion-col size="6">Created</ion-col>
              <ion-col>{{ timeSince(user.createdAt) }}</ion-col>
          </ion-row>
          <ion-row>
              <ion-col size="6">Last Seen</ion-col>
              <ion-col>{{ timeSince(user.updatedAt) }}</ion-col>
          </ion-row>
          <ion-row>
              <ion-col size="6">Overall Rank</ion-col>
              <ion-col>{{ user.overallRank }}</ion-col>
          </ion-row>
          <ion-row>
              <ion-col size="6">Weekly Rank</ion-col>
              <ion-col>{{ user.weeklyRank }}</ion-col>
          </ion-row>
          </ion-grid>
      </ion-card-content>
    </ion-card>
</template>

<script setup allowJs="true">
import { useAsyncState } from '@vueuse/core'
import { timeSince } from '../mgo1/strings.js'
import { getUserSummary } from '../mgo1/api.js'
const props = defineProps({
    user_id: Number,
    user: Object
})

const { state: user, isReady: userReady } = useAsyncState(async ()=>{
  if(props.user) {
    return props.user
  }  
  return await getUserSummary(props.user_id)
})
</script>

<style scoped>
.user-overview-card {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.emblem {
  background-image: url("../../public/assets/kojima-productions.png");
  background-blend-mode: color-burn;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
  margin: 10px;
  
}
</style>
