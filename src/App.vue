<script>
import { userStore } from "@/stores/user";


export default {
  components: {},
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
    <router-view></router-view>
  <!-- </keep-alive> -->
</template>

<style scoped>
</style>
