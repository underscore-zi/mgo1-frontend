<template>
  <ion-card>
    <ion-toolbar class="ion-margin-start" color="dark">
        <ion-card-title>Stats</ion-card-title>
        <ion-card-subtitle>{{ filterString }}</ion-card-subtitle>
    </ion-toolbar>
    <ion-card-content class="ion-padding">
      <ion-grid>
          <ion-row>
              <ion-col>
                  <ion-select interface="popover" v-model="filter.period" aria-label="Period" placeholder="Select Period">
                      <ion-select-option v-for="v in periods" v-bind:key="v" :value="v">{{ v }}</ion-select-option>
                  </ion-select>
              </ion-col>
              <ion-col>
                  <ion-select interface="popover"  v-model="filter.mode" aria-label="Mode" placeholder="Select Game Mode">
                      <ion-select-option value="">All Modes</ion-select-option>
                      <ion-select-option v-for="v in modes" v-bind:key="v" :value="v">{{ v }}</ion-select-option>
                  </ion-select>
              </ion-col>
              <ion-col>
                  <ion-select v-if="filter.period != 'archive'" interface="popover" v-model="filter.map" aria-label="Map" placeholder="Select Map">
                      <ion-select-option value="">All Maps</ion-select-option>
                      <ion-select-option v-for="v in maps" v-bind:key="v" :value="v">{{ v }}</ion-select-option>
                  </ion-select>
              </ion-col>
          </ion-row>
      </ion-grid>
      <ion-grid>
        <ion-row >
          <ion-col>
            <ion-item>
              <ion-label>Animal Rank</ion-label>
              <div slot="end" v-if="statsReady">{{ stats.animalRank() }}</div>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item>
              
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label>Ranking</ion-label>
              <div slot="end" v-if="rank">{{ rank }}</div>
              <div slot="end" v-else><em>Rank not available</em></div>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item>
              <ion-label>Points</ion-label>
              <div slot="end">{{ visibleStats["points"] }}</div>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row v-for="fields in fieldPairs" v-bind:key="fields[0]">
          <ion-col>
            <ion-item>
              <ion-label>{{ getStatName(fields[0]) }}</ion-label>
              <div slot="end" v-if="visibleStats[fields[0]]">{{ visibleStats[fields[0]] }}</div>
              <div slot="end" v-else>0</div>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item v-if="fields[1] != ''">
              <ion-label>{{ getStatName(fields[1]) }}</ion-label>
              <div slot="end" v-if="visibleStats[fields[1]]">{{ visibleStats[fields[1]] }}</div>
              <div slot="end" v-else>0</div>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
  </ion-card>
</template>
<script setup allowJs="true">
import { computed, ref, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { getUserStats } from '../mgo1/api.js'
import { duration, periods, modes, maps } from '../mgo1/strings.js'
import { IonSelectOption, IonSelect, IonCard, IonCardContent, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/vue';

const props = defineProps({
  id: String,
  overall_rank: Number,
  weekly_rank: Number,
})
watch(() => props.id, () => {executeStats()})

const { state: stats, isReady: statsReady, execute:executeStats} = useAsyncState(()=>{
    return getUserStats(props.id)
})

const filter = ref({
    period: "all-time",
    mode: "",
    map: "",
})

const visibleStats = computed(() => {
    if(statsReady.value === true) {
        const f = {period: filter.value.period}
        if(filter.value.mode !== "") { f.mode = filter.value.mode }
        if(filter.value.map !== "" && filter.value.period != "archive") { f.map = filter.value.map }
        const filtered = stats.value.filteredStats(f)

        // Run the couple special cases through duration
        if(filtered['play_time']) {
          filtered['play_time'] = duration(filtered['play_time']/1000000)
        }
        if(filtered['infrared_goggle_uses']) {
          filtered['infrared_goggle_uses'] = duration(filtered['infrared_goggle_uses']/1000000)
        }
        return filtered
    }
    return {}
})

const filterString = computed(() => {
    const mode = filter.value.mode?filter.value.mode:"All Modes"
    const map = filter.value.map?filter.value.map:"All Maps"
    return `${mode} in ${map} (${filter.value.period})`
})

const fieldPairs = computed(() => {
  const fields = []
  //fields.push(['rank', 'points'])
  fields.push(['kills','deaths'])
  fields.push(['kill_streak','death_streak'])
  if(filter.value.period != "archive") fields.push(['suicides','self_stuns'])
  fields.push(['stuns','stuns_received'])
  if(filter.value.mode != "deathmatch") { fields.push(['team_wins','']) }
  fields.push(['team_kills','team_stuns'])
  fields.push(['rounds_played','rounds_no_death'])

  if(filter.value.mode == "" || filter.value.mode == "capture") fields.push(['kerotans_for_win','kerotans_placed'])
  if(filter.value.mode == "" || filter.value.mode == "sneaking") { fields.push(['goals_as_snake', 'snake_frags']) }
  if(filter.value.mode == "" || filter.value.mode == "rescue") { fields.push(['gakos_rescued', ''] ) }

  fields.push(['radio_uses','text_chat_uses'])
  fields.push(['cqc_attacks','cqc_attacks_received'])
  fields.push(['head_shots','head_shots_received'])
  fields.push(['kills_with_knife','kills_with_scorpion'])
  fields.push(['rolls','times_eaten'])
  fields.push(['play_time','infrared_goggle_uses'])
  return fields
})

function getStatName(fieldName) {
  return fieldName.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, l => l.toUpperCase())
}

const rank = computed(() => {
  if(filter.value.period == "all-time" && filter.value.mode == "" && filter.value.map === "") { 
    return props.overall_rank 
  }
  if(filter.value.period == "weekly"   && filter.value.mode == "" && filter.value.map === "") {
    return props.weekly_rank 
  }
  if(visibleStats.value.rank) return visibleStats.value.rank
  return undefined
})

</script>

<style scoped>

</style>