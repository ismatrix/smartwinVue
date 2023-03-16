import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
// import './assets/main.css'

import router from "@/router/index.js";

import { createPinia } from "pinia";
const pinia = createPinia();

// import VueSocketIO from 'vue-3-socket.io'
// import SocketIO from 'socket.io-client';

// const baseURL = 'https://quantowin.com/'
// const marketsURL = 'https://quantowin.com/markets'
// const fundsURL = 'https://quantowin.com/funds'
// const s1 = SocketIO(baseURL, {
// 	useConnectionNamespace: true,
// });

// const app = SocketIO('http://localhost:1090', {
//   useConnectionNamespace: true,
// });

// const chat = SocketIO('http://localhost:1090/chat', {
//   useConnectionNamespace: true,
//   autoConnect: false,
// });

// Vue.use(new VueSocketIO({
// 	debug: true,
// 	connection: {
// 		s1,
// 	},
// }))

// new Vue({
// 	ElementPlus,
// 	router,
// 	pinia,
// 	render: h => h(App)
// }).$mount('#app')

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)
app.use(router)
app.use(pinia)
// app.use(new VueSocketIO({
// 	debug: true,
// 	connection: SocketIO(baseURL)}))
app.mount('#app')