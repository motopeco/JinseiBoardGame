<script lang="ts">
import { defineComponent } from 'vue'
import firebaseApp from '@/plugins/firebaseApp'
import { getAuth, onAuthStateChanged, signInAnonymously } from '@firebase/auth'
import websocket from '@/plugins/websocket'
import { useStore } from 'vuex'
import { key } from '@/store'

const auth = getAuth(firebaseApp)

const login = async () => {
  await signInAnonymously(auth)
}

const send = () => {
  websocket.getIO().emit('lobbies', { foo: 'bar', hoge: 1 })
}

onAuthStateChanged(auth, async (value) => {
  if (!value) return

  const token = await value.getIdToken()
  websocket.connect(token)
})

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const store = useStore(key)
    websocket.setStore(store)

    return {
      login,
      send,
    }
  },
})
</script>

<template>
  <div>
    <a @click="login">ログイン</a>
    <a @click="send">送信</a>
    {{ $store.state.auth }}
  </div>
</template>
