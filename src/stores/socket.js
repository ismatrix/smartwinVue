import { defineStore } from 'pinia'
import { Manager } from "socket.io-client";

const baseURL = 'https://quantowin.com'
const marketsURL = 'https://quantowin.com/markets'
const fundsURL = 'https://quantowin.com/funds'

const manager = new Manager(baseURL, { autoConnect: true })
const baseSocket = manager.socket('/')
const marketsSocket = manager.socket('/markets')
const fundsSocket = manager.socket('/funds')

// const baseSocket = io(baseURL)
// const marketsSocket = io(marketsURL)
// const fundsSocket = io(fundsURL)

baseSocket.on('connect', () => {
    // console.log(baseSocket.id)
})

marketsSocket.on('connect', () => {
    // console.log('marketsSocket')
})

fundsSocket.on('connect', () => {
    // console.log(fundsSocket.id)
})



export const socketsStore = defineStore({
    id: 'socketsStore',
    state: () => ({
        // baseSocket: new VueSocketIO({
        //     debug: true,
        //     connection: baseURL
        // }),
        // marketsSocket: new VueSocketIO({
        //     debug: true,
        //     connection: marketsURL
        // }),
        // fundsSocket: new VueSocketIO({
        //     debug: true,
        //     connection: fundsURL
        // }),
        baseSocket,
        marketsSocket,
        fundsSocket
    }),
    getters: {
        // doubleCount: (state) => state.count * 2
    },
    actions: {
        increment() {
            //   this.count++
        }
    }
})