import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { RootState } from '@/store/state'
import { authModule } from '@/store/auth'
import { userStatusModule } from '@/store/userStatus'
import { debugStateModule } from '@/store/debug'

export const key: InjectionKey<Store<RootState>> = Symbol()

export const store = createStore<RootState>({
  modules: {
    auth: authModule,
    userStatus: userStatusModule,
    debug: debugStateModule,
  },
})
