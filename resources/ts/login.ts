import * as Vue from 'vue'
import LoginPage from '@/pages/LoginPage.vue'
import { key, store } from './store'
//
const app = Vue.createApp({
  template: '<LoginPage></LoginPage>',
})

app.component('LoginPage', LoginPage)

app.use(store, key)

app.mount('#app')
