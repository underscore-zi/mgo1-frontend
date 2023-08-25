<template>
  <ion-page>
    <CommonHeader :title="title"></CommonHeader>
    <ion-content v-if="user">
      <OverviewCard :user_id="user.id" :user="user" />
      <ion-card>
        <ion-toolbar color="dark" class="ion-padding-start">
          <ion-card-title>Edit User</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-title>User Profile</ion-title>
          <ion-grid>
            <ion-row class="ion-padding-start">
              <ion-input type="text" v-model="displayName" label="Display Name" label-placement="floating"></ion-input>
            </ion-row>
            <ion-row class="ion-padding-start">
              <ion-input type="password" v-model="password" label="New Password" label-placement="floating"></ion-input>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-button color="dark" expand="block" @click="saveProfile">Save</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-title>Edit Emblem</ion-title>
          <ion-grid>
            <ion-row class="ion-padding-start">
              <ion-input v-model="emblemText" label="Emblem Text" label-placement="floating"></ion-input>
            </ion-row>
            <ion-row v-if="user.hasEmblem">
              <ion-col>
                <ion-button color="dark" expand="block" @click="saveEmblem">Save Emblem Text</ion-button>
              </ion-col>
              <ion-col>
                <ion-button color="danger" expand="block" @click="removeEmblem">Remove Emblem</ion-button>
              </ion-col>
            </ion-row>
            <ion-row v-else>
              <ion-col>
                <ion-button color="dark" expand="block" @click="saveEmblem">Give Emblem</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup allowJs="true">
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import CommonHeader from '@/components/CommonHeader.vue'
import OverviewCard from '@/components/OverviewCard.vue'
import { IonPage, IonContent, IonCard, IonRow, IonInput, IonButton } from '@ionic/vue';
import { useAsyncState } from '@vueuse/core'
import { getUserSummary } from '@/mgo1/api.js'
import { updateGameProfile, updateEmblem } from '@/mgo1/admin-api.js'

const route = useRoute()
const title = ref("Manage Player")
const password = ref("")
const emblemText = ref("")
const displayName = ref("")

const { state: user, execute:executeUser} = useAsyncState(async ()=>{
    const data = await getUserSummary(route.params.user_id)
    displayName.value = data.name
    emblemText.value = data.emblem
    return data
})

async function saveProfile() {
  await updateGameProfile(user.value.id, displayName.value, password.value)
  password.value = ""
  executeUser()
}

async function saveEmblem() {
  await updateEmblem(user.value.id, emblemText.value)
  executeUser()
}

async function removeEmblem() {
  await updateEmblem(user.value.id, "")
  executeUser()
}

</script>

<style scoped>

</style>