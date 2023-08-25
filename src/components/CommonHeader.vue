<template>
    <ion-header :translucent="true">
      <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button color="light"></ion-menu-button>
          </ion-buttons>
          <ion-title>{{title}}</ion-title>
      </ion-toolbar>
    </ion-header>
</template>
<script setup allowJs="true">
import { defineProps, watch } from 'vue'
import { useTitle } from '@vueuse/core'
import { IonMenuButton, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/vue';
const props = defineProps({
    title: String
})

watch(() => props.title, (newVal) => {
    useTitle(newVal)
})


</script>