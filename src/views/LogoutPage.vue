<template>
  <ion-page>
    <ion-content>
      <ion-card>
        <ion-toolbar class="ion-padding-start" color="dark"><ion-card-title>Logout?</ion-card-title></ion-toolbar>
        <ion-card-content>
          <ion-button color="danger" expand="block" @click="doLogout">Logout</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup allowJs="true">
import emitter from 'tiny-emitter/instance'
import { logout } from '@/mgo1/api.js'
import {IonPage, IonContent, IonCard, IonButton } from '@ionic/vue';
async function doLogout() {
  await logout()
  emitter.emit('logout')
}
</script>