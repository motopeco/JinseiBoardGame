<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GeneralLayout',
  setup() {},
})
</script>

<template>
  <el-container class="app-container">
    <el-main>
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
