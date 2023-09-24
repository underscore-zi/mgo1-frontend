<template>
  <ion-page>
      <CommonHeader title="Cheats" />
      <ion-content>
        <ion-card>
          <ion-toolbar color="dark">
            <ion-title class="ion-padding-start">Cheats</ion-title>
          </ion-toolbar>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col size="3">Region</ion-col>
                  <ion-col size="9">
                    <ion-radio-group v-model="selectedRegion">
                      <ion-list>
                        <ion-item v-for="region in region" :key="region">
                          <ion-label>{{ region }}</ion-label>
                          <ion-radio :value="region"/>
                        </ion-item>
                      </ion-list>
                    </ion-radio-group>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="3">Game</ion-col>
                  <ion-col size="9">
                    <ion-radio-group v-model="selectedGame">
                      <ion-list>
                        <ion-item v-for="game in games[selectedRegion]" :key="game">
                          <ion-label>{{ game }}</ion-label>
                          <ion-radio :value="game"/>
                        </ion-item>
                      </ion-list>
                    </ion-radio-group>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="3">Platform</ion-col>
                  <ion-col size="9">
                    <ion-radio-group v-model="selectedPlatform">
                      <ion-list>
                        <ion-item v-for="platform in platforms" :key="platform">
                          <ion-label>{{ platform }}</ion-label>
                          <ion-radio :value="platform"/>
                        </ion-item>
                      </ion-list>
                    </ion-radio-group>
                  </ion-col>
                </ion-row>
              <ion-row v-if="fileName != ''">
                <ion-col size="3">Filename</ion-col>
                <ion-col size="6">{{ fileName }}</ion-col>
                <ion-col size="3"><ion-button expand="block" @click="downloadCheats"><ion-icon :icon="downloadOutline"></ion-icon>Save</ion-button></ion-col>
              </ion-row>
                <ion-row>
                  <ion-col size="2"></ion-col>
                  <ion-col><pre>{{ cheatFile }}</pre></ion-col>
                </ion-row>

              </ion-grid>
            </ion-card-content>
        </ion-card>
      </ion-content>
  </ion-page>
</template>

<script setup allowJs="true">
import CommonHeader from "@/components/CommonHeader.vue";
import { IonPage, IonContent, IonCard, IonToolbar, IonRadio, IonRadioGroup } from "@ionic/vue";
import { ref, computed } from "vue";
import { downloadOutline } from "ionicons/icons";

const platforms = ref(["PCSX2", "PCSX2 (Legacy)", "Console (with Cheat Disc)", "Console (with Homebrew)"])
const selectedPlatform = ref("PCSX2")

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const region = ref(["NTSC-U", "NTSC-J", "PAL"])
const selectedRegion = ref("NTSC-U")

const games = ref({
  "NTSC-U": ["English/Spanish - SLUS-21243"],
  "NTSC-J": ["Japanese (Original) - SLPM-66221", "Japanese (Standalone) - SLPM-68524"],
  "PAL": ["English/French - SLES-82043", "Spanish - SLES-82049", "Italian - SLES-82045"]
})
const selectedGame = ref("English/Spanish - SLUS-21243")
const selectedGameName = computed(() => {
  return selectedGame.value.split(" - ")[0]
})
const selectedGameId = computed(() => {
  return selectedGame.value.split(" - ")[1]
})

const urlBlocks = ["3a707474","61732f2f","676d6576","6f632e6f","73752f6d","73676d2f","00002f33"]
const rawCheats = {
  // North American - English/Spanish
  "SLUS-21243": {
    "oldCrc": "01B2FA7F",
    "crc": "D46FD7EB",
    "master": [["90183688", "0C07b869"]],
    "conditional": ['D1322414', '00007474'],
    "disable-dnas": [
      ["2036b1e8", "24020000"],
      ["2036b1ec", "03e00008"],
      ["2036b1f0", "00000000"]
    ],
    "disable-crypto": [
      ["20199f38","03e00008"],
      ["20199f3c","00000000"]
    ],
    "url-rewrite": generateUrlRewrite("21322414"),
  },
  // Japanese (Original)
  "SLPM-66221": {
    "oldCrc": "3406B985",
    "crc": "[contact-us-if-you-have-this-disk]",
    "master": [["90183218","0C07b749"]],
    "conditional": ['D130FA74', '00007474'],
    "disable-dnas": [
      ["2035d5b8","24020000"],
      ["2035d5bc","03e00008"],
      ["2035d5c0","00000000"],
    ],
    "disable-crypto": [
      ["20199ab0","03e00008"],
      ["20199ab4","00000000"],
    ],
    "url-rewrite": generateUrlRewrite("2130FA74"),
  },
  // Japanese (Standalone)
  "SLPM-68524": {
    "oldCrc": "E09F13B5",
    "crc": "83C89D81",
    "master": [["901F8398","0C07E08E"]],
    "conditional": ["D130FA74","00007474"],
    "disable-dnas": [
      ["2035d6b8","24020000"],
      ["2035d6bc","03e00008"],
      ["2035d6C0","00000000"],
    ],
    "disable-crypto": [
      ["20199af0","03e00008"],
      ["20199af4","00000000"],
    ],
    "url-rewrite": generateUrlRewrite("2130FA74"),
  },
  // PAL - English/French
  "SLES-82043": {
    "oldCrc": "9F185CE1",
    "crc": "A197A623",
    "master": [["90184698","0C07B681"]],
    "conditional": ["D1321E34","00007474"],
    "disable-dnas": [
      ["2036bc98","24020000"],
      ["2036bc9c","03e00008"],
      ["2036bca0","00000000"],
    ],
    "disable-crypto": [
      ["20199790","03e00008"],
      ["20199794","00000000"],
    ],
    "url-rewrite": generateUrlRewrite("21321E34"),
  },
  // PAL - Spanish
  "SLES-82049": {
    "oldCrc": "8A5C25A7",
    "crc": "33744397",
    "master": [["90184698","0c07b681"]],
    "conditional": ["D130A0D4","00007474"],
    "disable-dnas": [
      ["2036bc98","24020000"],
      ["2036bc9c","03e00008"],
      ["2036bca0","00000000"],
    ],
    "disable-crypto": [
      ["20199790","03e00008"],
      ["20199794","00000000"],
    ],
    "url-rewrite": generateUrlRewrite("2130a0d4"),
  },
  // PAL - Italian
  "SLES-82045": {
    "oldCrc": "9F185CE1",
    "crc": "17708718",
    "master": [["90184698","0c07b681"]],
    "conditional": ["D130A0D4","00007474"],
    "disable-dnas": [
      ["2036bc98","24020000"],
      ["2036bc9c","03e00008"],
      ["2036bca0","00000000"],
    ],
    "disable-crypto": [
      ["20199790","03e00008"],
      ["20199794","00000000"],
    ],
    "url-rewrite": generateUrlRewrite("21309c44"),
  },
}

function formatLine(cheat) {
  if (selectedPlatform.value.indexOf("PCSX2") >= 0) {
    return `patch=1,EE,${cheat[0]},extended,${cheat[1]}`
  } else {
    return `${cheat[0]} ${cheat[1]}`
  }
}

function formatTitle(cheatName) {
  switch(selectedPlatform.value) {
    case "PCSX2":
    case "PCSX2 (Legacy)":
      return `comment=${cheatName}\n`
    default:
      return `[ ${cheatName} ]\n`
  }
}

function formatCheat(gameId, cheatName) {
  let out = formatTitle(cheatName)
  const cond = formatLine(rawCheats[gameId].conditional)
  rawCheats[gameId][cheatName].forEach(cheat => {
    if(cheatName == "master") {
      out += `${formatLine(cheat)}\n`
    } else {
      out += `${cond}\n${formatLine(cheat)}\n`
    }
  })
  return out + "\n"
}

function generateUrlRewrite(startAddr) {
  let addr = parseInt(startAddr, 16)
  const cheat = []
  urlBlocks.forEach(block => {
    const entry = []
    entry.push(addr.toString(16))
    entry.push(block)
    addr += 4
    cheat.push(entry)
  })
  return cheat
}

const cheatFile = computed(() => {
  let out = ""

  // Header
  switch(selectedPlatform.value) {
    case "Console (with Homebrew)":
      out += `"Metal Gear Online - ${selectedGameName.value} /ID ${selectedGameId.value}"\n`
      break;
  }

  // Master if necessary
  switch(selectedPlatform.value) {
    case "PCSX2":
    case "PCSX2 (Legacy)":
      break;
    default:
      out += formatCheat(selectedGameId.value, "master")
  }

  out += formatCheat(selectedGameId.value, "disable-dnas")
  out += formatCheat(selectedGameId.value, "disable-crypto")
  out += formatCheat(selectedGameId.value, "url-rewrite")
  return out
})

const fileName = computed(()=>{
  const id = selectedGameId.value.replace("-", "_")
  switch(selectedPlatform.value) {
    case "PCSX2":
    return `${selectedGameId.value}_${rawCheats[selectedGameId.value].crc}.pnach`
    case "PCSX2 (Legacy)":
      return `${rawCheats[selectedGameId.value].oldCrc}.pnach`
    case "Console (with Homebrew)":
      return `${id.slice(0,-2)}.${id.slice(-2)}.cht`
    default:
      return ""
  }
})


function downloadCheats() {
  if(fileName.value == "") return
  const a = document.createElement('a') 
  const blob = new Blob([cheatFile.value], {type: "text/plain"}) // Create a blob (file-like object)
  const url = URL.createObjectURL(blob) // Create an object URL from blob
  a.setAttribute('href', url) // Set "a" element link
  a.setAttribute('download', fileName.value) // Set download filename
  a.click() // Start downloading
}
</script>