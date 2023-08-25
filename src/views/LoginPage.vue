<template>
    <ion-page>
      <ion-content>
      <CommonHeader title="Login" />
        <ion-card>
          <ion-toolbar :color="isAdminLogin?'danger':'dark'" class="ion-padding-start ion-padding-end">
            <ion-card-title>Login</ion-card-title>
            <ion-toggle slot="end" v-model="isAdminLogin">Login as Admin</ion-toggle>
          </ion-toolbar>
            <ion-card-content class="ion-padding">
              <div :class="errorClass" v-if="lastError!=''">{{ lastError }}</div>
              <form @submit.prevent="login">
              <ion-input @keyup.enter="login" v-model="state.username" label="Username" label-placement="floating"></ion-input>
              <ion-input @keyup.enter="login" v-model="state.password" type="password" label="Password" label-placement="floating"></ion-input>
              <ion-button color="dark" expand="block" type="submit">Login</ion-button>
              </form>
            </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-page>
</template>
<script setup allowJs="true">
import CommonHeader from '../components/CommonHeader.vue'
import emitter from 'tiny-emitter/instance'
import { loginUser, loginAdmin } from '../mgo1/api.js'
import { IonPage, IonInput, IonCardContent, IonCard, IonToggle, toastController } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const isAdminLogin = ref(false)
const state = ref({
  "username":"",
  "password":"",
})
const toast = ref(null)

async function login() {
  try {
    if(toast.value) {
      await toast.value.dismiss();
    }
    const loginFunc = isAdminLogin.value?loginAdmin:loginUser
    const results = await loginFunc(state.value.username, state.value.password)
    emitter.emit('login', isAdminLogin.value?'admin':'user', results)
    router.push({name: 'home'})
  } catch (e) {
      toast.value = await toastController.create({
        message: e.message,
        duration: 15000,
        position: 'top',
        color: 'danger',
      });
      await toast.value.present();    
  } 
}
</script>
<style scoped>

</style>