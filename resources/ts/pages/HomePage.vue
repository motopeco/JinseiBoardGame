<script lang="ts">
import { defineComponent } from 'vue'

const playerCount = (gameData: GameData) => {
  console.log(gameData.players)
  return gameData.players.length
}

export default defineComponent({
  name: 'HomePage',
  setup() {
    return {
      playerCount,
    }
  },
})
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="20" :offset="2">
      <el-table :data="$store.state.lobby.rooms">
        <el-table-column prop="id" label="ID" />
        <el-table-column label="ステータス">
          <template #default="scope">
            {{ scope.row.isStart ? 'ゲーム中' : '待機中' }}
          </template>
        </el-table-column>
        <el-table-column label="プレイヤー数">
          <template #default="scope">
            {{ playerCount(scope.row.gameData) }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <el-button>参加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
