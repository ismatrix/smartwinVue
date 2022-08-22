import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue"
import About from "@/views/About.vue"
import Login from "@/views/Login.vue"
import MarketOverview from "@/components/market/MarketOverview.vue"
import FundList from "@/components/fund/FundList.vue"
import Trade from "@/components/trade/Trade.vue"

let routes = [
  {
    path: "/login",
    name: 'Login',
    component: Login,
  },
  {
    path: "/",
    name: 'Home',
    component: Home,
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: "",
        name: "MarketOverview",
        component: MarketOverview,
        meta: {
          keepAlive: true
        }
      },
      {
        path: "/fundlist",
        name: 'FundList',
        component: FundList,
        meta: {
          keepAlive: true
        }
      },
      {
        path: "/trade",
        name: 'Trade',
        component: Trade,
        meta: {
          keepAlive: true
        }
      },
    ]
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router
