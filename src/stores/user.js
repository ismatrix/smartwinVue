import { defineStore } from 'pinia'

export const userStore = defineStore({
  id: 'user',
  state: () => ({
    status: 1,
    token: localStorage.getItem("token")
  }),
  getters: {
    // doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.status++
    }
  }
})