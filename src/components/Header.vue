<script>
import { ref } from 'vue'

export default {
  name: 'Header',
  data() {
    return {
      activeIndex: '/'
    }
  },
  created() {
    let url = window.location.href
    if (url.indexOf('/fundpro/') != -1 || url.indexOf('/funds') != -1 ) {
      this.activeIndex = '/funds'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}

</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
    router
  >
    <el-menu-item index="/">行情</el-menu-item>
    <el-menu-item index="/funds">基金产品</el-menu-item>
    
    <el-sub-menu index="3">
      <template #title>Workspace</template>
      <el-menu-item index="/fundlist">item one</el-menu-item>
      <el-menu-item index="3-2">item two</el-menu-item>
      <el-menu-item index="3-3">item three</el-menu-item>
      <el-sub-menu index="3-4">
        <template #title>item four</template>
        <el-menu-item index="3-4-1">item one</el-menu-item>
        <el-menu-item index="3-4-2">item two</el-menu-item>
        <el-menu-item index="3-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="4" disabled>Info</el-menu-item>
    <el-menu-item index="/trade">Orders</el-menu-item>
  </el-menu>
</template>


