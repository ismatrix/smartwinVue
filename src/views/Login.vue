<script>
import { userStore } from "@/stores/user";
import { UserService } from "@/utils/api.js";

export default {
  data() {
    const user = userStore();
    return {
      user,
      loginParams: {
        userid: "",
        password: "",
      },
    };
  },
  methods: {
    increment() {
      this.user.increment();
      this.$router.push({ path: "/" });
    },
    loginBtn() {
      UserService.login(this.loginParams).then((res) => {
        if (res.ok) {
          this.$router.push({ path: "/"})
          localStorage.setItem("token", res.token);
        }
      });
    },
  },
};
</script>

<template>
  <div class="login-box">
    <el-form :model="loginParams" ref="loginParams" label-width="60px" class="login-form">
      <h2 class="login-title">Login</h2>
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名" v-model="loginParams.userid"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          placeholder="请输入密码"
          v-model="loginParams.password"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loginBtn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login-form {
  width: 350px;
  background-color: #fff;
  padding: 15px;
  height: 250px;
  border-radius: 20px;
  position: absolute;
  margin-top: -125px;
  margin-left: -175px;
  top: 50%;
  left: 50%;
}
.login-box {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #ccc;
}
.login-title {
  color: #333;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>