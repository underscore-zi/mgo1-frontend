<template>
  <ion-page>
    <CommonHeader title="Manage Roles" />
    <ion-content v-if="dataReady">
      <ion-card>
        <ion-toolbar color="dark">
          <ion-card-title class="ion-padding-start">Roles</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-grid>
            <ion-row class="table-header">
              <ion-col size="2">Name</ion-col>
              <ion-col v-for="name,field of privs" v-bind:key="field">{{ name }}</ion-col>
              <ion-col>&nbsp;</ion-col>
            </ion-row>
            <ion-row class="vertical-align-content" v-for="role,i in data.roles" v-bind:key="role.id">
              <ion-col size="2">{{ role.name }}</ion-col>
              <ion-col v-for="name,field of privs" v-bind:key="field">
                <ion-checkbox @ionChange="privChange(i, field, data.roles[i][field])" v-model="data.roles[i][field]"></ion-checkbox>
              </ion-col>
              <ion-col>
                <ion-button size="small" v-if="dirtyRoles[role.id]" @click="saveRole(data.roles[i])" fill="clear"><ion-icon :icon="save"/></ion-button>
                <ion-button v-if="roleCounts[role.id] === undefined" fill="clear" color="danger" size="small" @click="deleteRole(data.roles[i])"><ion-icon :icon="trash"></ion-icon></ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-toolbar color="dark" class="ion-padding-start">
          <ion-card-title>Create Role</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col>
              <ion-input label="New Role Name" label-placement="floating" v-model="newRoleName"></ion-input>  
            </ion-col>
            </ion-row>
            <ion-row>
                <ion-col><ion-button @click="createRole" expand="block" color="dark" size="small">Create</ion-button></ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-toolbar color="dark">
          <ion-card-title class="ion-padding-start">Notes</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ul>
            <li>Roles can only be deleted if no users are assigned to it.</li>
            <li>In order to modify a role with "App Privileges" or add it to another role you must be logged into an account with "All Privileges."</li>
            <li>If one has "Search by IP" but not "See Full IPs" then their search will be limited to just the first three octlets of the IP.</li>
            <li>The "Update Players" privilege is to modify in-game accounts, whereas Manage Users is for administrative users (this page.)</li>
          </ul>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
  
<script setup allowJs="true">
import CommonHeader from '@/components/CommonHeader.vue'
import {IonPage, IonContent, IonCheckbox, IonIcon, IonButton, IonInput } from '@ionic/vue'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { getUserAndRoles, updateRole } from '@/mgo1/admin-api.js'
import { save, trash } from 'ionicons/icons'

const privs = {
  "all_privileges": "All Privileges",
  "update_profiles": "Update Players",
  "full_ips": "See Full IPs",
  "search_by_ip": "Search by IP",
  "read_bans": "Read Bans",
  "update_bans": "Update Bans",
  "manage_users": "Manage Users",
  "manage_news": "Manage News",
  "manage_policy": "Manage Policy",
}


const newRoleName = ref("")
const dirtyRoles = ref({})

const { state: data, isReady: dataReady, execute:refreshUsers } = useAsyncState(()=> {
  return getUserAndRoles()
})

const roleCounts = computed(()=>{
  const counts = {}
  for (const user of data.value.users) {
    if (counts[user.role_id] === undefined) {
      counts[user.role_id] = 1
    }
    counts[user.role_id] += 1
  }
  return counts
})

function privChange(i) {
  dirtyRoles.value[data.value.roles[i].id] = true
}

async function saveRole(role) {
  await updateRole(role, false)
  dirtyRoles.value[role.id] = false
  refreshUsers()
}

async function deleteRole(role) {
  await updateRole(role, true)
  dirtyRoles.value[role.id] = false
  refreshUsers()
}

async function createRole() {
  if(newRoleName.value == "") {
    return
  }
  await updateRole({
    "id": 0,
    "name": newRoleName.value,
  }, false)
  newRoleName.value = ""
  refreshUsers()
}


</script>

<style scoped>
.vertical-align-content {
  display: flex;
  align-items: center;
}
</style>