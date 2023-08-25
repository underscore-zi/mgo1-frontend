<template>
  <ion-page>
    <CommonHeader :title='title' />
    <ion-content v-if="isReady">
      <ion-card>
        <ion-toolbar class="ion-padding-start" color="dark">
          <ion-card-title>Change Display Name</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-row>
            <ion-input label="Display Name" label-placement="floating" v-model="displayName"></ion-input>
          </ion-row>
          <ion-row>
            <ion-col><ion-button @click="changeDisplayName" expand="block" color="dark">Change</ion-button></ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-toolbar class="ion-padding-start" color="dark">
          <ion-card-title>Change Password</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-row>
            <ion-input label="Old Password" type="password" label-placement="floating" v-model="oldPassword"></ion-input>
          </ion-row>
          <ion-row>
            <ion-input label="New Password" type="password" label-placement="floating" v-model="newPassword"></ion-input>
          </ion-row>
          <ion-row>
            <ion-input label="Confirm New Password" type="password" label-placement="floating" v-model="confirmPassword"></ion-input>
          </ion-row>
          <ion-row>
            <ion-col><ion-button :disabled="newPassword.length > 3 && newPassword != confirmPassword" @click="changePassword" expand="block" color="dark">Change</ion-button></ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>      
    </ion-content>
  </ion-page>
</template>

<script setup allowJs="true">
import CommonHeader from '@/components/CommonHeader.vue'
import { useAsyncState } from '@vueuse/core'
import {IonPage, IonContent, IonCard, IonRow, IonInput, IonButton } from '@ionic/vue'
import { ref, computed } from 'vue'
import { whoAmI, updateProfile } from '../mgo1/api.js'
import emitter from 'tiny-emitter/instance'

const { state: user, isReady: userReady, execute:executeUser} = useAsyncState(async ()=>{
    const user = await whoAmI()
    displayName.value = user.user.display_name
    return user.user
})

const title = computed(() => {
    if(userReady.value === true) {
        return `My Account (${user.value.display_name})`
    }
    return "Loading User..."
})

const displayName = ref("")
const oldPassword = ref("")
const newPassword = ref("")
const confirmPassword = ref("")

async function changeDisplayName() {
  const result = await updateProfile(displayName.value, "", "")
  if(result !== false) {
    displayName.value = ""
    emitter.emit("success", "Display name changed successfully")
  }
  executeUser()
}

async function changePassword() {
  const result = await updateProfile("", oldPassword.value, newPassword.value)
  oldPassword.value = ""
  newPassword.value = ""
  confirmPassword.value = ""
  if(result !== false) {
    emitter.emit("success", "Password changed successfully")
  }
  executeUser()
}

import { addLoader } from '@/loader.js'
const isReady = computed(() => {
  return userReady.value
})
addLoader("Loading Account...", [isReady])
</script>

<style scoped>
.vertical-align-content {
  display: flex;
  align-items: center;
}

</style>