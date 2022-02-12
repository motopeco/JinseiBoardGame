<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import Instance from '@/game/Instance'

export default defineComponent({
  name: 'GamePage',
  setup() {
    const store = useStore(key)
    const instance = new Instance(store)

    instance.getGame().events.once('ready', () => {
      instance.getGame().events.emit('run')
    })
  },
})
</script>

<template>
  <el-row>
    <el-col>aa</el-col>
  </el-row>
</template>
