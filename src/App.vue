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
    console.log("app created");
    const user = userStore();
    // console.log(user.status)
    user.$subscribe((mutation, state) => {
      // console.log(mutation)
      // console.log(JSON.stringify(state))
    });
    // this.$socket.emit()
  },
  mounted() {
    console.log("app mounted");
  },
};
</script>

<template>
  <!-- <keep-alive> -->
  <!-- <router-view></router-view> -->
  <!-- </keep-alive> -->
  <Header v-if="$route.name != 'Login'"/>
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

<style scoped>
</style>
