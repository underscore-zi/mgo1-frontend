<template>
  <ion-page>
    <CommonHeader title="Manage Users" />
    <ion-content v-if="dataReady">
      <ion-card>
        <ion-toolbar color="dark">
          <ion-card-title class="ion-padding-start">Users</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-grid>
            <ion-row v-for="user of data.users" v-bind:key="user.id">
              <ion-col>{{ user.username }}</ion-col>
              <ion-col>{{roleMap[user.role_id].name}}</ion-col>      
              <ion-col>
                <ion-button v-if="!roleMap[user.role_id].all_privileges" :id="'edit-user-'+user.id" fill="clear">
                  <ion-icon :icon="pencil"></ion-icon>
                </ion-button>
              </ion-col>
            </ion-row>
            <ion-modal v-for="(user,i) of data.users" v-bind:key="user.id" :trigger="'edit-user-'+user.id">
              <ion-toolbar><ion-card-title class="ion-padding-start">Edit {{ user.username }}</ion-card-title></ion-toolbar>
              <ion-card-content>
                <form @submit.prevent="doUpdateUser(i)">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-input label="Username" label-placement="floating" v-model="updateModels[i].username"></ion-input>
                    </ion-col>
                    <ion-col>
                      <ion-select label="Role" label-placement="floating" v-model="updateModels[i].role_id">
                        <ion-select-option id="role_id" name="role_id" v-for="role of data.roles" v-bind:key="role.id" :value="role.id">{{role.name}}</ion-select-option>
                      </ion-select>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-input label="Password" type="password" label-placement="floating"  v-model="updateModels[i].password"></ion-input>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button type="submit" expand="block" color="dark">Submit Changes</ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
                </form>
              </ion-card-content>
            </ion-modal>
          </ion-grid>
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-toolbar color="dark"><ion-card-title class="ion-padding-start">Add User</ion-card-title></ion-toolbar>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-input label="Username" label-placement="floating" v-model="newUser.username"></ion-input>
              </ion-col>
              <ion-col>
                <ion-select v-model="newUser.role_id" label="Role" label-placement="floating">
                  <ion-select-option v-for="role of data.roles" v-bind:key="role.id" :value="role.id">{{role.name}}</ion-select-option>
                </ion-select>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-input type="password" label="Password" label-placement="floating" v-model="newUser.password"></ion-input>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-button :disabled="addButtonDisabled" color="dark" expand="block" @click="createUser">Create</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
  
<script setup allowJs="true">
import CommonHeader from '@/components/CommonHeader.vue'
import { IonPage, IonContent, IonIcon, IonButton, IonInput, IonSelect, IonSelectOption, IonModal, modalController } from '@ionic/vue'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { getUserAndRoles, updateUser } from '@/mgo1/admin-api.js'
import { pencil } from 'ionicons/icons'

const newUser = ref({
  username: "",
  password: "",
  role_id: 1,
})

const { state: data, isReady: dataReady, execute:refreshUsers } = useAsyncState(()=> {
  return getUserAndRoles()
})

const roleMap = computed(()=>{
  const out = {}
  for (const role of data.value.roles) {
    out[role.id] = role
  }
  return out
})

const updateModels = computed(() => {
  const out = []
  if(data.value === undefined) {
    return out
  }
  for(const user of data.value.users) {
    out.push({
      "id": user.id,
      "username": user.username,
      "password": user.password,
      "role_id": user.role_id,
    })
  }
  return out
})

const addButtonDisabled = computed(() => {
  if(newUser.value.username === "" || newUser.value.password === "") {
    return true
  }
  if(roleMap.value[newUser.value.role_id] === undefined) {
    return true
  }
  return false
})

async function createUser() {
  const info = newUser.value
  await updateUser(0, info.username, info.password, info.role_id, false)
  newUser.value.username = ""
  newUser.value.password = ""
  await refreshUsers()
}

async function doUpdateUser(i) {
  const info = updateModels.value[i]
  modalController.dismiss()
  await updateUser(info.id, info.username, info.password, info.role_id, false)
  await refreshUsers()
}

</script>

<style scoped>
.vertical-align-content {
  display: flex;
  align-items: center;
}
</style>