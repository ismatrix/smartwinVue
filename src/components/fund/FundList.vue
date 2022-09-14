<script>
import { useCounterStore } from "@/stores/counter"
import { socketsStore } from "@/stores/socket"

export default {
  data() {
    
    const counterStore = useCounterStore()
    const sockets = socketsStore()
    return {
      counterStore,
      sockets,
      count: 2
      // socketsStore
      // socket: new VueSocketIO({
      //   debug: true,
      //   connection: "https://quantowin.com",
      // }),
      // socket_markets: new VueSocketIO({
      //   debug: true,
      //   connection: "https://quantowin.com/markets",
      // }),
      // socket: io("https://quantowin.com"),
      // socket_markets: io("https://quantowin.com/markets"),
    }
  },
  created() {
    
    // this.sockets.baseSocket.io.on('connect', (res) => {
    //   console.log(res)
    // })
    // this.sockets.baseSocket.emit('setToken', {'token': localStorage.token}, (res) => {
    //   console.log(res)
    // })
    // this.socket_markets.subscribe('tick', (res) => {
    //   console.log(res)
    // })
    // this.sockets.marketsSocket.io.on('connect', (res) => {
    //   console.log(res)
    // })
    // this.sockets.marketsSocket.emit('subscribe', {'type': 'futures', 'symbol': 'rb2301', 'resolution': 'tick'}, (res) => {
    //   console.log(res)  
    // })
    // this.sockets.marketsSocket.on('tick', (data) => {
    //   console.log(data)
    // })
    // so.emit('setToken', {'token': localStorage.token}, res => {
    //   console.log('set token')
    // })
    // this.sockets.fundsSocket.on('tick', (data) => {
    //   console.log('funsSocket')
    // })
  },
  methods: {
    test() {
      this.count++
    }
  },
  mounted() {
    console.log('fundlist mounted')
  },
  unmounted() {
    console.log('unmounted')
  }
}



</script>

<template>
  {{ count }}
  <el-button type="primary" @click="test">Primary</el-button>
</template>

<style lang="" scoped>
</style>
