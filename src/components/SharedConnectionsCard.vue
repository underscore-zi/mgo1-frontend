<template>
    <ion-card v-if="connectionsReady">
        <ion-toolbar color="dark" class="ion-padding-start title">
            <ion-card-title>Shared Connections</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
            <ion-grid>
                <ion-row v-if="hasSharedConnections">
                    <ion-col size="4">Shared IP</ion-col>
                    <ion-col size="4">Username (Display Name)</ion-col>
                    <ion-col size="2"></ion-col>
                    <ion-col size="2"></ion-col>
                </ion-row>
                <ion-row v-for="connection in connections" :key="connection.id">
                    <ion-col size="4">
                        <router-link :to="`/admin/search/ip/${searchableIP(connection.remote_addr)}/1`">
                            {{ connection.remote_addr }}
                        </router-link>
                    </ion-col>
                    <ion-col size="4">
                        {{ connection.u2_display_name }} ({{ connection.u2_username }})
                    </ion-col>
                    <ion-col size="2">
                        <router-link :to="`/users/${connection.u2_id}`">
                            Profile
                        </router-link>
                    </ion-col>
                    <ion-col size="2">
                        <router-link :to="`/admin/player/${connection.u2_id}`">
                            Manage User
                        </router-link>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </ion-card>
</template>

<script setup allowJs="true">
import { useAsyncState } from '@vueuse/core'
import { getSharedConnections } from '../mgo1/admin-api.js'
import { computed } from 'vue'

const props = defineProps({
    user_id: Number,
})

const hasSharedConnections = computed(() => {
  return connectionsReady && connections.value.length > 0
})

const searchableIP = function(ip) {
    if(ip.endsWith(".xxx")) {
        ip = ip.substring(0, ip.length - 4)
    }
    return ip
}


const { state: connections, isReady: connectionsReady } = useAsyncState(async ()=>{
  return await getSharedConnections(props.user_id)
})
</script>