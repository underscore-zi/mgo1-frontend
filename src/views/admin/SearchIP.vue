<template>
    <ion-page>
      <CommonHeader :title="title"></CommonHeader>
      <ion-content v-if="resultsReady">
        <ion-card>
          <ion-toolbar color="dark">
            <ion-grid slot="start" class="title ion-margin">
              <ion-card-title>Search Results</ion-card-title>
            </ion-grid>
          </ion-toolbar>
  
          <ion-card-content>
            <ion-row v-if="results.length == 0"><em>No Results</em></ion-row>  
            <ion-row v-else>
                <ion-col size="2">Last Used</ion-col>
                <ion-col size="2">Username</ion-col>
                <ion-col size="2">Remoate Address</ion-col>
                <ion-col size="2">Local Address</ion-col>
                <ion-col size="2">Created At</ion-col>
            </ion-row>
            <ion-row v-for="conn in results" v-bind:key="conn.id">
                <ion-col size="2">
                    {{ timeSince(new Date(Date.parse(conn.last_used))) }}
                </ion-col>
                <ion-col size="2">
                    <router-link :to="`/users/${conn.user.id}`">{{ conn.user.name}}</router-link>
                </ion-col>
                <ion-col size="2">
                    {{ conn.remote_addr }}
                </ion-col>
                <ion-col size="2">
                    {{ conn.local_addr }}
                </ion-col>
                <ion-col size="2">{{ conn.created_at }}</ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="12" class="ion-text-center">
                  <ion-button v-if="page>1" @click="page--" fill="clear"><ion-icon :icon="arrowBack"></ion-icon></ion-button>
                  <ion-button v-if="results.length >= limit" @click="page++" fill="clear"><ion-icon :icon="arrowForward"></ion-icon></ion-button>
                </ion-col>
              </ion-row>
          </ion-card-content>
        </ion-card>
  
      </ion-content>
    </ion-page>
  </template>
  
  <script setup allowJs="true">
  import { IonPage, IonContent, IonCard, IonRow } from '@ionic/vue';
  import { computed, watch, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router';
  import { useAsyncState } from '@vueuse/core'
  import { searchIP } from '@/mgo1/admin-api.js'
  import { timeSince } from '@/mgo1/strings.js'
  import { arrowBack, arrowForward } from 'ionicons/icons';
  import CommonHeader from '@/components/CommonHeader.vue'
  const limit = 50 // should match server as its how it can detect when there are no more pages
  const route = useRoute()
  const router = useRouter()
  const ip = route.params.ip
  const page = ref(route.params.page || 1)
  const title = computed(() => {
    return `Search IP: ${ip}`
  })
  
  const { state: results, isReady: resultsReady } = useAsyncState(()=>{
    return searchIP(ip, page.value)
  })
  
  
  watch([ip, page], ([newIP, newPage]) => {
    router.push({name: 'search-ip', params: {ip: newIP, page: newPage}, direction:"forward" })
  })
  
  
  </script>