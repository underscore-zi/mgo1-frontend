<template>
  <ion-page>
    <CommonHeader title="Ban List" />
    <ion-content>
      <ion-card>
        <ion-toolbar color="dark" class="ion-padding-start">
          <ion-card-title>Active Ban List</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-grid>
            <ion-row class="table-header vertical-align-content">
              <ion-col>User</ion-col>
              <ion-col>Type</ion-col>
              <ion-col size="5">Reason</ion-col>
              <ion-col>Expires</ion-col>
              <ion-col>Created By</ion-col>
              <ion-col>&nbsp;</ion-col>
            </ion-row>
            <ion-row :class="(i%2?'even':'odd') + ' vertical-align-content'" v-for="b,i in bans" v-bind:key="b.id">
              <ion-col><router-link :to="`/users/${b.user.id}`">{{ b.user.display_name }}</router-link></ion-col>
              <ion-col>{{ b.ban_type }}</ion-col>
              <ion-col size="5" class="ban-reason">{{ b.reason }}</ion-col>
              <ion-col>{{ b.expires_at.split("T")[0] }}</ion-col>
              <ion-col>{{ b.created_by }} <span v-if="b.updated_by">(Last Updated By: {{ b.updated_by }})</span></ion-col>
              <ion-col>
                <ion-button @click="deleteBan(b.id, b.ban_type, b.reason, b.user.id)" color="danger" fill="clear" size="small">
                  <ion-icon :icon="trashBin" size="small"></ion-icon>
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-toolbar color="dark" class="ion-padding-start">
          <ion-card-title>Create Ban</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-row>
            <ion-col size="auto">
              <ion-input @ionBlur="updateUser" label="User ID" label-placement="floating" v-model="newBan.user_id"></ion-input>
            </ion-col>
            <ion-col>
              {{ selectedDisplayname }}  
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col><ion-checkbox v-model="newBan.banIps" labelPlacement="end">Ban IPs?</ion-checkbox></ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-input label="Reason" label-placement="floating" v-model="newBan.reason"></ion-input>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="2">Expiration</ion-col>
            <ion-col size="2">
              <ion-datetime-button  datetime="datetime"></ion-datetime-button>
              <ion-modal :keep-contents-mounted="true">
                <ion-datetime v-model="newBan.expiration" presentation="date" :year-values="yearValues" :min="minTime" ref="expirationDate" id="datetime"></ion-datetime>
              </ion-modal>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col><ion-button @click="createBan" expand="block" color="dark">Create</ion-button></ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup allowJs="true">
import CommonHeader from '@/components/CommonHeader.vue'
import { ref, computed } from 'vue'
import {IonPage, IonContent, IonInput, IonDatetime, IonDatetimeButton, IonModal } from '@ionic/vue'
import { onIonViewWillEnter } from '@ionic/vue'
import { useAsyncState } from '@vueuse/core'
import { getUserSummary } from '@/mgo1/api.js'
import { getBans, updateBan } from '@/mgo1/admin-api.js'
import { trashBin } from 'ionicons/icons'

const { state: bans, execute:refreshBans } = useAsyncState(()=> {
  return getBans()
})

const yearValues = computed(()=>{
  const out = []
  const d = new Date()
  for(let i = 0; i < 10; i++) {
    out.push(d.getFullYear() + i)
  }
  return out
})
const minTime = computed(()=>{
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(0,0,0,0)
  return d.toISOString()
})
const selectedDisplayname = ref("")
const newBan = ref({
  user_id: "",
  reason: "",
  banIps: true,
  expiration: minTime.value,
})



onIonViewWillEnter(async () => {
  refreshBans()
})

async function updateUser() {
  const uid = newBan.value.user_id
  if(uid.length == 0) {
    selectedDisplayname.value = ""
    return
  }

  selectedDisplayname.value = "Loading..."
  try {
    const user = await getUserSummary(uid)
    if(user.hasEmblem) {
      selectedDisplayname.value = `${user.name} (${user.emblem})`
    } else {
      selectedDisplayname.value = user.name
    }
  } catch(err) {
    selectedDisplayname.value = `Error: ${err}`
  }
}

async function createBan() {
  try{
    const expiration = newBan.value.expiration.split("T")[0] + "T00:00:00.000Z"
    await updateBan(0, newBan.value.banIps?"IP":"User", expiration, newBan.value.reason, Number(newBan.value.user_id))
  } catch(err) {
    alert(err)
    return
  }
  newBan.value = {
    user_id: "",
    reason: "",
    expiration: minTime.value,
  }
  refreshBans()
}

async function deleteBan(ban_id, ban_type, reason, user_id) {
  try{
    await updateBan(ban_id, ban_type, "1970-01-01T00:00:00.000Z", reason, user_id)
  } catch(err) {
    alert(err)
    return
  }
  refreshBans()
}
</script>


<style scoped>
.table-header {
  font-weight: bolder;
}
.ban-reason {
  white-space: pre-wrap;
}

.vertical-align-content {
  display: flex;
  align-items: center;
}
.odd {
  background-color: #333333;
}
.even {
  background-color: #222222;
}
</style>