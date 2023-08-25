<template>
  <ion-page>
    <CommonHeader title="Guides" />
    <ion-content>
      <ion-card>
        <ion-toolbar color="dark" class="ion-padding-start">
          <ion-card-title>DNS Information</ion-card-title>
        </ion-toolbar>
        <ion-card-content>
          <ion-grid class="ion-padding highlight-row">
            <ion-row class="ion-padding-bottom">In order to connect to the SaveMGO servers you must be using our DNS records. The easiest way to do this is to use our DNS address</ion-row>
            <ion-row>
              <ion-col size="6" size-lg="3">Primary</ion-col>
              <ion-col>198.148.102.54</ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="6" size-lg="3">Secondary</ion-col>
              <ion-col><em>Leave Blank</em></ion-col>
            </ion-row>
          </ion-grid>

          <ion-grid class="ion-padding highlight-row">
            <ion-row class="ion-padding-bottom">While using our DNS is the easiest option if you'd like to run your own or use the PCSX2 internal DNS the following records are necessary</ion-row>
            <ion-row>
              <ion-col size="6" size-lg="3">savemgo.com</ion-col>
              <ion-col>198.148.102.54</ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="6" size-lg="3">mgs3sgate01.konamionline.com</ion-col>
              <ion-col>198.148.102.54</ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="6" size-lg="3">mgs3sgate02.konamionline.com</ion-col>
              <ion-col>198.148.102.54</ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="6" size-lg="3">mgs3sgate03.konamionline.com</ion-col>
              <ion-col>198.148.102.54</ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="6" size-lg="3">mgs3sstun.konamionline.com</ion-col>
              <ion-col>15.204.66.207</ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- Setup Guides -->
      <ion-card>
        <ion-toolbar color="dark" class="ion-padding-start">
          <ion-card-title>Setup Guides</ion-card-title>
        </ion-toolbar>
        <ion-card-content>

          <ion-accordion-group>
            <ion-accordion v-for="entry in setupGuides" v-bind:key="entry.url">
              <ion-item slot="header" color="dark">
                <ion-label>{{ entry.title }}</ion-label>
              </ion-item>
              <div class="ion-padding youtube-container" slot="content" v-if="entry.type=='youtube'">
                <iframe
                  width="560"
                  height="315"
                  :src='`https://www.youtube.com/embed/${entry.url}&autoplay=1`'
                  :srcdoc="`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/${entry.url}?autoplay=1><img src=https://img.youtube.com/vi/${entry.url}/hqdefault.jpg alt='${entry.title}'><span>▶</span></a>`"
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  :title="entry.title"
                ></iframe>
              </div>
            </ion-accordion>
          </ion-accordion-group>

        </ion-card-content>
      </ion-card>

      <!-- Gameplay Guides -->
      <ion-card>
        <ion-toolbar color="dark" class="ion-padding-start">
          <ion-card-title>Gameplay Guides</ion-card-title>
        </ion-toolbar>
        <ion-card-content>

          <ion-accordion-group>
            <ion-accordion v-for="entry in gameplayGuides" v-bind:key="entry.url">
              <ion-item slot="header" color="dark">
                <ion-label>{{ entry.title }}</ion-label>
              </ion-item>
              <div class="ion-padding youtube-container" slot="content" v-if="entry.type=='youtube'">
                <iframe
                  width="560"
                  height="315"
                  :src='`https://www.youtube.com/embed/${entry.url}&autoplay=1`'
                  :srcdoc="`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/${entry.url}?autoplay=1><img src=https://img.youtube.com/vi/${entry.url}/hqdefault.jpg alt='${entry.title}'><span>▶</span></a>`"
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  :title="entry.title"
                ></iframe>



                
              </div>
            </ion-accordion>
          </ion-accordion-group>

        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup allowJs="true">
import CommonHeader from '@/components/CommonHeader.vue'
import { IonPage, IonContent, IonAccordion, IonAccordionGroup  } from '@ionic/vue';

const setupGuides = [
  { 
    type: "youtube", 
    title: "PS2 Setup", 
    url: "2mjyAopxa90"
  },
  {
    type: "youtube",
    title: "PCSX2 Setup (QT version)",
    url: "MbuHK7JUTgU"
  },
  {
    type: "youtube",
    title: "PCSX2 Troubleshooting (QT version)",
    url: "4W9RvgkuG7Q",
  },
  {
    type: "youtube",
    title: "PCSX2 Setup (Legacy version)",
    url: "-qY_zbWy01M",
  },
  {
    type: "youtube",
    title: "PCSX2 - HD Textures",
    url: "jtl3nZyCEOY",
  },
]

const gameplayGuides = [
  {
    type: "youtube",
    title: "Box Tips",
    url: "nuqHcLSf9pw",
  },
  {
    type: "youtube",
    title: "Shooting/Aiming Tip",
    url: "ydlU4vqzIGM",
  },
  {
    type: "youtube",
    title: "Stun Recovery Tip",
    url: "VoMdFbRqmrQ",
  },
  {
    type: "youtube",
    title: "Auto-aim Cancel Tip",
    url: "waFAZX664xo",
  },
  {
    type: "youtube",
    title: "Easy Headshot Tip",
    url: "GJCoSYWxBiI",
  },
  {
    type: "youtube",
    title: "Three Stun Techniques",
    url: "iLKpQnQtbrs",
  },
  {
    type: "youtube",
    title: "Auto-aim Tip",
    url: "pZTGhlzD0KU",
  },
  {
    type: "youtube",
    title: "Voice and Text Chat",
    url: "pO3_UVsic1c",
  },
]
</script>

<style scoped>
.youtube-container iframe {
  margin: 0 auto;
  display: block;
}
.highlight-row ion-row:hover:not(:first-of-type) {
  background-color: #333;
  color: #fff;
}
</style>