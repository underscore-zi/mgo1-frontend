import {loadingController} from '@ionic/vue';
import { watch, computed  } from 'vue'

export async function addLoader(message, conditions) {
  const isLoading = computed(()=>{
    return !conditions.every((c) => c.value)
  })

  let loader = null
  if(isLoading.value) {
    loader = await loadingController.create({
      message: message,
      spinner: 'crescent',
      cssClass: 'loading-class'
    })
    loader.present()
  }
  watch(isLoading, async (newVal) => {
    if(newVal) {
      loader = await loadingController.create({
        message: message,
        spinner: 'crescent',
        cssClass: 'loading-class'
      })
      await loader.present()
    }
    else await loader.dismiss()
  })
}