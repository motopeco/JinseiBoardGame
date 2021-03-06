<script lang="ts">
import { defineComponent } from 'vue'
import websocket from '@/plugins/websocket'
import SocketClientEvent from '../../../constants/SocketClientEvent'
import CommonResult = SocketServerData.CommonResult
import { useStore } from 'vuex'
import { key } from '@/store'
import { getAuth, signInAnonymously } from '@firebase/auth'
import firebaseApp from '@/plugins/firebaseApp'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const store = useStore(key)

    const login = () => {
      const auth = getAuth(firebaseApp)
      signInAnonymously(auth)
    }

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

    const start = () => {
      websocket.getIO().emit(SocketClientEvent.StartGame, {}, (response: CommonResult) => {
        console.log('start', response)
      })
    }

    const next = () => {
      websocket.getIO().emit(SocketClientEvent.DoNextGame, {}, (response: CommonResult) => {
        console.log('next', response)
      })
    }

    return {
      login,
      createRoom,
      leaveRoom,
      ready,
      start,
      next,
    }
  },
})
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="12" :offset="6">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-button @click="login">ログイン</el-button>
        </el-col>
        <el-col :span="24">
          <el-button @click="createRoom"> ルーム作成 </el-button>
        </el-col>
        <el-col :span="24">
          <el-button @click="leaveRoom"> ルーム退室 </el-button>
        </el-col>
        <el-col :span="24">
          <el-button @click="ready"> レディー </el-button>
        </el-col>
        <el-col :span="24">
          <el-button @click="start"> スタート </el-button>
        </el-col>
        <el-col :span="24">
          <el-button @click="next"> ネクスト </el-button>
        </el-col>
        <el-col :span="24">
          {{ $store.state.userStatus }}
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="24">
      <el-table :data="$store.state.debug.events">
        <el-table-column prop="event" label="イベント" />
        <el-table-column prop="result" label="結果">
          <template #default="scope">
            {{ scope.row.result }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
