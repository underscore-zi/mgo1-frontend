<template>
<ion-page>
  <ion-content v-if="news">
    <CommonHeader title="Home" />
    <ion-card v-if="news.length == 0">
      <ion-toolbar color="dark">
        <ion-title>News</ion-title>
      </ion-toolbar>
      <ion-card-content>
        <ion-grid><em>No news to display</em></ion-grid>
      </ion-card-content>
    </ion-card>
    <ion-card v-else v-for="entry in news" v-bind:key="entry.created_at"> 
      <ion-toolbar color="dark">
        <ion-title>{{ entry.title }}</ion-title>
      </ion-toolbar>
      <ion-card-content>
        <ion-grid>
          <ion-row>
            <ion-col size="12">
              <ion-text class="news-content">{{ entry.content }}</ion-text>
            </ion-col>
          </ion-row>
          <ion-footer>
            <ion-text class="ion-text-start">Posted {{ timeSince(new Date(Date.parse(entry.created_at))) }}</ion-text>
          </ion-footer>
        </ion-grid>
      </ion-card-content>
    </ion-card>
  </ion-content>
  </ion-page>
</template>

<script setup allowJs="true">
import { useAsyncState } from '@vueuse/core'
import { getNews } from '../mgo1/api.js'
import { IonPage } from '@ionic/vue';
import CommonHeader from '../components/CommonHeader.vue'
import { timeSince } from '../mgo1/strings.js'

const { state: news } = useAsyncState(()=>{
  return getNews()
})
</script>
<style scoped>
.news-content {
  white-space: pre-wrap
}
ion-footer {
  margin-top: 15px;
  padding-top: 5px;
  border-top-style: solid;
  border-top-color: var(--ion-color-dark);
  border-top-width: 2px;
}
ion-card-content {
  padding-top: 0px;
}
</style>