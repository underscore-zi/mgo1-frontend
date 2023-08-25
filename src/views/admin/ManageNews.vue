<template>
  <ion-page>
    <CommonHeader :title="title" />
    <ion-content v-if="newsReady">
      <ion-row class="center-button" v-if="!creating.enabled">
        <ion-button fill="outline" color="success" @click="toggleCreateNews">Create News</ion-button>
      </ion-row>
      <ion-card v-if="creating.enabled">
        <ion-toolbar color="dark">
          <ion-title>Create News</ion-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-input label="Topic Title" label-placement="floating" :counter="true" maxlength="62" v-model="creating.topic"></ion-input>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-textarea v-model="creating.body" label="Body" label-placement="floating" :counter="true" maxlength="512" :auto-grow="true"></ion-textarea>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-button fill="outline" color="success" @click="doCreateNews">Create</ion-button>
                <ion-button fill="outline" color="danger" @click="toggleCreateNews">Cancel</ion-button>
              </ion-col>
              </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
      <ion-card v-for="n,i in news" v-bind:key="n.title + n.created_at">
        <ion-toolbar color="dark" class="ion-padding-end">
          <ion-title v-if="editingID != n.id">{{ n.title }}</ion-title>
          <ion-title v-else>
            <ion-input fill="outline" :counter="true" maxlength="62" v-model="news[i].title"></ion-input>
          </ion-title>
          <div class="actions" slot="end" v-if="editingID != n.id && deletingID != n.id">
            <ion-icon :icon="pencil" color="primary" @click="toggleEditNews(n.id)"></ion-icon>
            <ion-icon :icon="trashOutline" color="danger" @click="toggleDeleteNews(n.id)"></ion-icon>
          </div>
          <div class="actions" slot="end" v-else-if="editingID == n.id">
            <ion-button fill="clear" color="success" @click="saveNews(n.id)">Save</ion-button>
          </div>
          <div class="actions" slot="end" v-else-if="deletingID == n.id">
                <ion-text>Are you Sure?</ion-text>
                <ion-button fill="clear" color="danger" @click="deleteNews(n.id)">Yes</ion-button>
                <ion-button fill="clear" color="success" @click="toggleDeleteNews(-1)">No</ion-button>
          </div>
        </ion-toolbar>
        <ion-card-content>
          <ion-grid>
            <ion-row v-if="editingID != n.id">
              <ion-col size="12">
                <ion-text class="news-content">{{ n.content }}</ion-text>
              </ion-col>
            </ion-row>
            <ion-row v-else>
              <ion-col size="12">
                <ion-textarea fill="outline" :auto-grow="true"  :counter="true" maxlength="512" v-model="news[i].content" />
              </ion-col>
            </ion-row>
            <ion-footer>
              <ion-text class="ion-text-start">Posted {{ timeSince(new Date(Date.parse(n.created_at))) }}</ion-text>
            </ion-footer>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup allowJs="true">
import CommonHeader from '@/components/CommonHeader.vue'
import { IonPage, IonContent, IonCard, IonRow, IonInput, IonButton, IonTextarea } from '@ionic/vue';
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { getNews } from '@/mgo1/api.js'
import { timeSince } from '@/mgo1/strings.js'
import { trashOutline, pencil } from 'ionicons/icons'
import { updateNews, createNews } from '@/mgo1/admin-api.js'

const creating = ref({
  enabled: false,
  topic: "",
  body: ""
})
const editingID = ref(-1)
const deletingID = ref(-1)
const title = computed(()=>{
  return "Manage News"
})

const { state:news, isReady:newsReady, execute:executeNews} = useAsyncState(()=>{
  return getNews()
})

async function doCreateNews() {
  await createNews(creating.value.topic, creating.value.body)
  toggleCreateNews()
  executeNews()
}
async function deleteNews(id) {
  const entry = news.value.find(n=>n.id == id)
  if (!entry) return  
  await updateNews(id, "","")
  editingID.value = -1
  executeNews()
}
async function saveNews(id) {
  const entry = news.value.find(n=>n.id == id)
  if (!entry) return  
  await updateNews(id, entry.title, entry.content)
  editingID.value = -1
  executeNews()
}

function toggleEditNews(id) {
  editingID.value = id
}

function toggleDeleteNews(id) {
  deletingID.value = id
}

function toggleCreateNews() {
  creating.value.enabled = !creating.value.enabled
}
</script>

<style scoped>
.news-content {
  white-space: pre-wrap
}
ion-footer {
  margin-top: 15px;
  padding-top: 5px;
  border-top-style: solid;
  border-top-color: var(--ion-color-dark);
  border-top-width: 2px;
}

ion-card-content {
  padding-top: 0px;
}

.actions ion-icon {
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
}

.center-button ion-button {
  margin-left: auto;
  margin-right: auto;
}
.center-button {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>