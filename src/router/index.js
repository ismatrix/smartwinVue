import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue"
import About from "@/views/About.vue"
import Login from "@/views/Login.vue"
import MarketOverview from "@/components/market/MarketOverview.vue"
import FundList from "@/components/fund/FundList.vue"
import FundPro from "@/components/fund/FundPro.vue"
import Funds from "@/components/fund/Funds.vue"
import Trade from "@/components/trade/Trade.vue"
import Test from "@/components/test/T1.vue"
import Ind from "@/components/ind/Ind.vue"

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
        path: "/funds",
        name: 'Funds',
        component: Funds,
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


routes = [
  // {
  //   path: "/",
  //   name: "MarketOverview",
  //   component: MarketOverview,
  //   meta: {
  //     keepAlive: true
  //   }
  // },
  {
    path: "/login",
    name: 'Login',
    component: Login,
  },
  {
    path: "/funds",
    name: 'Funds',
    component: Funds,
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
    path: "/fundpro/:fundid",
    name: 'FundPro',
    component: FundPro,
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
  {
    path: "/test",
    name: 'Test',
    component: Test,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/ind",
    name: 'Ind',
    component: Ind,
    meta: {
      keepAlive: true
    }
  },
]
const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/smartwinVue/' : '/'),
  routes,
});

router.beforeEach(async (to, from) => {
  if (!localStorage.token && to.name !== 'Login') {
    return {name: 'Login'}
  }
})
export default router
