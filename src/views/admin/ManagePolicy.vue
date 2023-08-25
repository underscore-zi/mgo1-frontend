<template>
  <ion-page>
    <ion-content v-if="policyReady">
      <ion-card>
        <ion-toolbar color="dark">
          <ion-title>In-Game Policy</ion-title>
        </ion-toolbar>
          <ion-grid class="ion-padding">
            <ion-row>
              <ion-textarea v-model="policy.content" label="Body" label-placement="stacked" placeholder="[empty]" :auto-grow="true"></ion-textarea>
            </ion-row>
            <ion-row>
              <ion-col><ion-button color="dark" expand="block" @click="savePolicy">Save</ion-button></ion-col>
            </ion-row>
          </ion-grid>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup allowJs="true">
import { IonPage, IonContent, IonTextarea } from '@ionic/vue';
import { getPolicy } from '@/mgo1/api.js'
import { updatePolicy } from '@/mgo1/admin-api.js'
import { useAsyncState } from '@vueuse/core'
import emitter from 'tiny-emitter/instance'

const { state:policy, isReady:policyReady, execute:executePolicy} = useAsyncState(()=>{
  return getPolicy()
})

async function savePolicy() {
  const result = await updatePolicy(policy.value.content)
  if ( result !== false) {
    emitter.emit("success", "Policy has been updated.")
  }
  await executePolicy()
}


</script>

<style scoped>
.content-area {
  padding: 10px;
}
</style>