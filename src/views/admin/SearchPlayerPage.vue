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
            <ion-row v-else v-for="player in results" v-bind:key="player.id">
                <ion-col size="3">{{ player.name  }}</ion-col>
                <ion-col size="2"><router-link :to="`/users/${player.id}`" router-direstion="root">Public Profile</router-link></ion-col>
                <ion-col size="2"><router-link :to="`/admin/player/${player.id}`" router-direstion="root">Manage User</router-link></ion-col>
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
  import { searchName } from '@/mgo1/admin-api.js'
  import { arrowBack, arrowForward } from 'ionicons/icons';
  import CommonHeader from '@/components/CommonHeader.vue'
  const limit = 50 // should match server as its how it can detect when there are no more pages
  const route = useRoute()
  const router = useRouter()
  const name = route.params.name
  const page = ref(route.params.page || 1)
  const title = computed(() => {
    return `Search: ${name}`
  })
  
  const { state: results, isReady: resultsReady } = useAsyncState(()=>{
    return searchName(name, page.value)
  })
  
  watch([name, page], ([newName, newPage]) => {
    router.push({name: 'search-player', params: {name: newName, page: newPage}, direction:"forward" })
  })
  
  
  </script>