<script>


export default {
  components: {
  },
  data() {
    const mdTableData = [
      {
        instrument: 'rb2301',
        price: 4000,
        change: 1.2,
      },
    ]
    return {
      mdTableData
    };
  },
  mounted() {
    
  },
  methods: {
    
  }
};
</script>

<template>
  <el-row :gutter="0">
    <el-col :span="6">
        <el-table :data="mdTableData" style="width: 100%; height: 100%" header-cell-class-name="trade-md-header-cell">
          <el-table-column prop="instrument" label="合约" min-width="30%" align="left" />
          <el-table-column prop="price" label="最新价" min-width="30%" align="center" />
          <el-table-column prop="change" label="涨跌幅" min-width="40%" align="right">
            <template #default="scope">
              <span class="font-color-red">
              {{scope.row.change.toFixed(2) + '%'}}
              </span>
            </template>
          </el-table-column>
           <!-- :formatter="(row, col, value, index) => parseFloat(value).toFixed(2) + '%'" / -->
        </el-table>
    </el-col>
    <el-col :span="12"><div class="grid-content ep-bg-purple" />2</el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" />2</el-col>
  </el-row>
</template>



<style>
.trade-md-header-cell {
  font-weight: 400;
  color: #758696;
  font-size: 13px;
}
</style>
