<script>
import Header from "@/components/Header.vue";
import MarketOverview from "@/components/market/MarketOverview.vue";
import { userStore } from "@/stores/user";

export default {
  components: {
    Header,
    MarketOverview,
  },
  data() {
    const user = userStore();
    return {
      user,
    };
  },
  beforeCreate() {
    const user = userStore();
    // console.log(user.status)

    if (user.status == 0) {
      this.$router.push({ path: "/login" });
    }
  },
  created() {
    const user = userStore();
    // console.log(user.status)

    if (user.status == 0) {
      this.$router.push({ path: "/login" });
    }

    user.$subscribe((mutation, state) => {
      // console.log(mutation)
      // console.log(JSON.stringify(state))
    });
  },
  mounted() {},
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header><Header /></el-header>
      <el-main>
        <!-- <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component
              :is="Component"
              :key="route.name"
              v-if="route.meta.keepAlive"
            />
          </keep-alive>
          <component
            :is="Component"
            :key="route.name"
            v-if="!route.meta.keepAlive"
          />
        </router-view> -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
</style>
