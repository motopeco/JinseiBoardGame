<script lang="ts">
import { defineComponent } from 'vue'
import websocket from '@/plugins/websocket'
import SocketClientEvent from '../../../constants/SocketClientEvent'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const createRoom = () => {
      const data: SocketClientData.CreateRoomData = {
        name: 'foobar',
        password: 'password',
      }

      websocket.getIO().emit(SocketClientEvent.CreateNewRoom, data, (response) => {
        console.log(response)
      })
    }

    const leaveRoom = () => {
      websocket.getIO().emit(SocketClientEvent.LeaveRoom, {}, (response) => {
        console.log('leaveRoom', response)
      })
    }

    return {
      createRoom,
      leaveRoom,
    }
  },
})
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="12" :offset="6">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-button>ログイン</el-button>
        </el-col>
        <el-col :span="24">
          <el-button @click="createRoom">ルーム作成</el-button>
        </el-col>
        <el-col :span="24">
          <el-button @click="leaveRoom">ルーム退室</el-button>
        </el-col>
        <el-col :span="24">{{ $store.state.userStatus }}</el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
