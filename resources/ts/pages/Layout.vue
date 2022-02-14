<script lang="ts">
import { defineComponent } from 'vue'
import { getAuth, onAuthStateChanged, signInAnonymously } from '@firebase/auth'
import firebaseApp from '@/plugins/firebaseApp'
import websocket from '@/plugins/websocket'
import { useStore } from 'vuex'
import { key } from '@/store'

const auth = getAuth(firebaseApp)

onAuthStateChanged(auth, async (value) => {
  if (!value) return

  const token = await value.getIdToken()
  websocket.connect(token)
})

export default defineComponent({
  name: 'GeneralLayout',
  setup() {
    const store = useStore(key)
    websocket.setStore(store)
  },
})
</script>

<template>
  <el-container class="app-container">
    <el-main>
      ユーザID = {{ $store.state.auth.id }}
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<style lang="scss">
html,
body {
  margin: 0;
  background: #fffffe;
}

.app-container {
  header {
    background: #272343;
    border-bottom: 1px solid #1b182f;
  }
}
</style>
