<script lang="ts">
import { defineComponent } from 'vue'
import websocket from '@/plugins/websocket'
import SocketClientEvent from '../../../constants/SocketClientEvent'
import CommonResult = SocketServerData.CommonResult
import { useStore } from 'vuex'
import { key } from '@/store'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const store = useStore(key)

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
      websocket.getIO().emit(SocketClientEvent.LeaveRoom, {}, (response: CommonResult) => {
        console.log('leaveRoom', response)

        if (response.isSuccess) {
          store.commit('userStatus/leaveRoom')
        }
      })
    }

    const ready = () => {
      websocket.getIO().emit(SocketClientEvent.ReadyGame, {}, (response: CommonResult) => {
        console.log('ready', response)
      })
    }

    return {
      createRoom,
      leaveRoom,
      ready,
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
        <el-col :span="24">
          <el-button @click="ready">レディー</el-button>
        </el-col>
        <el-col :span="24">{{ $store.state.userStatus }}</el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
