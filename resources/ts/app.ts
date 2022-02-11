import * as Vue from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import LoginPage from '@/pages/LoginPage.vue'
import { key, store } from './store'
import router from '@/route'
//
const app = Vue.createApp({
  template: '<router-view></router-view>',
})

app.component('LoginPage', LoginPage)

app.use(ElementPlus)
app.use(store, key)
app.use(router)

app.mount('#app')
