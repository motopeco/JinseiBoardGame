<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginPage',
  setup() {},
})
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="12" :offset="6">
      <el-button>ログイン</el-button>
    </el-col>
  </el-row>
</template>
