<template>
    <ion-card v-if="settingsReady">
        <ion-toolbar class="ion-padding-start" color="dark">
          <ion-card-title>In-Game Settings</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-title>Camera Settings</ion-title>
            </ion-row>
            <ion-row>
              <ion-col>Up/Down Direction</ion-col>
              <ion-col>
                <span class="toggle-off">Normal</span>
                <ion-toggle v-model="settings.tpv_invert_vertical" :disabled="!props.editable"></ion-toggle>
                <span class="toggle-on">Reverse</span> 
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>Left/Right Direction</ion-col>
              <ion-col>
                <span class="toggle-off">Normal</span>
                <ion-toggle v-model="settings.tpv_invert_horizontal" :disabled="!props.editable"></ion-toggle>
                <span class="toggle-on">Reverse</span> 
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>Rotation Speed</ion-col>
              <ion-col>
                <ion-range v-model="settings.tpv_rotation_speed" min="1" max="10" :ticks="true" :snaps="true" :disabled="!props.editable">
                  <div slot="start">{{ settings.tpv_rotation_speed }}</div>
                </ion-range>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>Chase Camera While Shooting</ion-col>
              <ion-col>
                <ion-toggle v-model="settings.tpv_chase_camera" :disabled="!props.editable"></ion-toggle>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-title>First Person View Settings</ion-title>
            </ion-row>
            <ion-row>
              <ion-col>Up/Down Direction</ion-col>
              <ion-col>
                <span class="toggle-off">Normal</span>
                <ion-toggle v-model="settings.fpv_invert_vertical" :disabled="!props.editable"></ion-toggle>
                <span class="toggle-on">Reverse</span> 
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>Left/Right Direction</ion-col>
              <ion-col>
                <span class="toggle-off">Normal</span>
                <ion-toggle v-model="settings.fpv_invert_horizontal" :disabled="!props.editable"></ion-toggle>
                <span class="toggle-on">Reverse</span> 
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>Rotation Speed</ion-col>
              <ion-col>
                <ion-range v-model="settings.fpv_rotation_speed" min="1" max="10" :ticks="true" :snaps="true" :disabled="!props.editable">
                  <div slot="start">{{ settings.fpv_rotation_speed }}</div>
                </ion-range>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>Default Direction at Switch</ion-col>
              <ion-col>
                <ion-select v-model="settings.fpv_switch_orientation" :disabled="!props.editable">
                  <ion-select-option value="Player Orientation">Player Orientation</ion-select-option>
                  <ion-select-option value="Camera Orientation">Camera Orientation</ion-select-option>
                </ion-select>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>Switch Speed</ion-col>
              <ion-col>
                <ion-range v-model="settings.switch_speed" min="1" max="10" :ticks="true" :snaps="true" :disabled="!props.editable">
                  <div slot="start">{{ settings.switch_speed }}</div>
                </ion-range>
              </ion-col>
            </ion-row>


            <ion-row>
              <ion-title>Display Settings</ion-title>
            </ion-row>
            <ion-row>
              <ion-col>Show Name Tags</ion-col>
              <ion-col><ion-toggle v-model="settings.show_name_tags" :disabled="!props.editable"></ion-toggle></ion-col>
            </ion-row>

            <ion-row>
              <ion-title>Weapon/Equipment Switch</ion-title>
            </ion-row>
            <ion-row>
              <ion-col>Weapon Switch</ion-col>
              <ion-col>
                <ion-select v-model="settings.weapon_switch_style" :disabled="!props.editable">
                  <ion-select-option value="Flashback">Flashback</ion-select-option>
                  <ion-select-option value="Cycle">Cycle</ion-select-option>
                  <ion-select-option value="Equipped/Unequipped">Equipped/Unequipped</ion-select-option>
                </ion-select>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>Equipment Switch</ion-col>
              <ion-col>
                <ion-select v-model="settings.equipment_switch_style" :disabled="!props.editable">
                  <ion-select-option value="Flashback">Flashback</ion-select-option>
                  <ion-select-option value="Cycle">Cycle</ion-select-option>
                  <ion-select-option value="Equipped/Unequipped">Equipped/Unequipped</ion-select-option>
                </ion-select>
              </ion-col>
            </ion-row>
            <ion-grid v-if="props.fkeys">
            <ion-row>
              <ion-title>F-Keys</ion-title>
            </ion-row>
            <ion-row v-for="str,i in settings.FKeys" v-bind:key="i+'-'+str">
              <ion-input :label="`F-Key ${i+1}`" label-placement="stacked" placeholder="[empty]" v-model="settings.FKeys[i]" :disabled="!props.editable"></ion-input>
            </ion-row>
            <ion-row v-if="props.editable">
              <ion-col><ion-button expand="block" color="dark" @click="doSaveSettings">Save Settings</ion-button></ion-col>
            </ion-row>
            </ion-grid>


          </ion-grid>
        </ion-card-content>
      </ion-card>
</template>

<script setup allowJs="true">
import { useAsyncState } from '@vueuse/core'
import { IonCard, IonRow, IonInput, IonButton, IonToggle, IonRange, IonSelect, IonSelectOption} from '@ionic/vue'
import { getIngameSettings, saveSettings } from '../mgo1/api.js'
import emitter from 'tiny-emitter/instance'

const props = defineProps({
  user_id: Number,
  editable: Boolean,
  fkeys: Boolean
})

const { state: settings, isReady: settingsReady, execute:executeSettings} = useAsyncState(async ()=>{
  if(props.user_id){
    return await getIngameSettings(props.user_id)
  } else {
    throw new Error("missing user_id")
  }
})

async function doSaveSettings() {
  const result = await saveSettings(settings.value)
  if(result !== false) {
    emitter.emit("success", "Settings saved successfully")
    executeSettings()
  }
}
</script>

<style scoped>
.toggle-on {
  margin-left:5px;
}
.toggle-off {
  margin-right: 5px;
}
ion-row {
  display: flex;
  align-items: center;
}
ion-title {
  padding-inline: 0px;
  padding-top: 15px;
  margin-bottom: 15px;
  border-bottom-style:solid;
  border-bottom-color: var(--ion-color-dark);
  border-bottom-width:2px;
}
</style>