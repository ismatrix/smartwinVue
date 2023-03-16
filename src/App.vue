<script>
import { userStore } from "@/stores/user";
import Home from "@/views/Home.vue"
import Header from "@/components/Header.vue"

export default {
  components: {
    Header
  },
  data() {
    const user = userStore();
    return {
      user,
    };
  },
  created() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTI0YTBiNDM3NjhiZDdmNDI1ODdhN2YiLCJ1c2VyaWQiOiJ3aWxsIiwiZHB0IjpbIuS4iua1t-WKniJdLCJpYXQiOjE2Nzg0NDA2MTF9.ElemfbyP4Az6vT5TWFecIKdbZemfnRO7aaYmDBeFdmU'
    localStorage.setItem("token", token);
    
    // console.log("app created");
    const user = userStore();
    // console.log(user.status)
    user.$subscribe((mutation, state) => {
      // console.log(mutation)
      // console.log(JSON.stringify(state))
    });
    // this.$socket.emit()
  },
  mounted() {
    // console.log("app mounted");
  },
};
</script>

<template>
  <!-- <keep-alive> -->
  <!-- <router-view></router-view> -->
  <!-- </keep-alive> -->
  <!-- <Header v-if="$route.name != 'Login'"/> -->
  <!-- <router-view v-slot="{ Component }">
    <keep-alive>
      <component
        :is="Component"
        :key="$route.name"
        v-if="$route.meta.keepAlive"
      />
    </keep-alive>
    <component
      :is="Component"
      :key="$route.name"
      v-if="!$route.meta.keepAlive"
    />
  </router-view> -->
  <router-view></router-view>
</template>

<style>
html, body, #app {
  margin:0;
  padding:0;
  height:100%;
}
#app {
  /* padding: 0px 10px; */
}
.font-color-red {
  /* font-family: Overpass,sans-serif; */
  color: #ff231f;
}
.font-color-green {
  color: #26de81;
}
</style>
