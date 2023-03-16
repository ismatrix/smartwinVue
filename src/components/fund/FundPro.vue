<script>
import { FundService } from "@/utils/api.js";
import { ref } from 'vue'
import NetvalueChart from "@/components/charts/NetvalueChart.vue"

export default {
  name: "FundPro",
  components: {
    NetvalueChart
  },
  props: {},
  data() {
    console.log(this.$route.params.fundid);
    return {
      baseInfo: {},
      activeTab: ref('first'),
      fundid: this.$route.params.fundid
    };
  },
  created() {
    FundService.fundpro(this.fundid).then((res) => {
      console.log(res);
      this.baseInfo.fund = res.fund
    });

    FundService.dynamicEquity(this.fundid).then((res) => {
      this.baseInfo.dynamicEquity = res.dynamicEquity
    });

    FundService.fundproTotal(this.fundid).then((res) => {
      this.baseInfo.total = res.total
    });
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    formatDigits(value) {
      return value.toLocaleString(undefined, {minimumFractionDigits: 2})
    }
  },
};
</script>
<template >
  <div style="padding: 10px 30px">
  <el-row :gutter="2">
    <el-col :span="4" :style="{'background-color': '#e35b5a'}">
      <div class="grid-content ep-bg-purple">
      <p class="text-center" style="color: white; font-size: 25px">
        {{baseInfo.fund && baseInfo.fund.fundname}}
      </p>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.dynamicEquity ? formatDigits(baseInfo.dynamicEquity) : "0.00"}}</p>
        <p class="text-center font-11">期货户</p>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.total ? formatDigits(baseInfo.total.stockaccount): "0.00"}}</p>
        <p class="text-center font-11">股票户</p>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.total ? formatDigits(baseInfo.total.fixedincome) : "0.00"}}</p>
        <p class="text-center font-11">固收金额</p>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.total ? formatDigits(baseInfo.total.append): "0.00"}}</p>
        <p class="text-center font-11">追加金额</p>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.total ? formatDigits(baseInfo.total.cost) : "0.00"}}</p>
        <p class="text-center font-11">成本合计</p>
      </div>
    </el-col>
  </el-row>
  <el-divider/>
  <el-row :gutter="2" style="margin-top: -20px">
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.fund ? formatDigits(baseInfo.fund.equitybeginning) : "0.00"}}</p>
        <p class="text-center font-11">初始规模</p>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.total ? formatDigits(baseInfo.total.hostingaccount) : "0.00"}}</p>
        <p class="text-center font-11">托管户</p>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.total ? formatDigits(baseInfo.total.bondaccount) : "0.00"}}</p>
        <p class="text-center font-11">债券户</p>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.total ? formatDigits(baseInfo.total.fixedincomereturns) : "0.00"}}</p>
        <p class="text-center font-11">固收收益</p>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.total ? formatDigits(baseInfo.total.redemption) : "0.00"}}</p>
        <p class="text-center font-11">赎回金额</p>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <p class="text-center font-25">{{baseInfo.total ? formatDigits(baseInfo.total.costout) : "0.00"}}</p>
        <p class="text-center font-11">成本扣除合计</p>
      </div>
    </el-col>
  </el-row>
  </div>
  <el-tabs type="border-card" v-model="activeTab" class="demo-tabs" @tab-click="handleClick" :style="{'margin': '30px 30px'}">
    <el-tab-pane label="净值权益" name="first">
      <Netvalue-Chart :fundid="fundid" /> 
    </el-tab-pane>
    <el-tab-pane label="基本信息" name="second"></el-tab-pane>
    <el-tab-pane label="申购赎回" name="third"></el-tab-pane>
    <el-tab-pane label="固定成本" name="fourth"></el-tab-pane>
    <el-tab-pane label="收益分成" name="fifth"></el-tab-pane>
    <el-tab-pane label="交易通道" name="sixth"></el-tab-pane>
    <el-tab-pane label="服务程序" name="seventh"></el-tab-pane>
  </el-tabs>
</template>


<style>
/* .demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
} */
</style>
<style scoped>
.text-center {
  text-align: center;
}
.font-25 {
  font-size: 25px;
  color: #7f90a4;
  margin-bottom: 0;
}
.font-11 {
  font-size: 11px;
  color: #5b9bd1;
  font-weight: 800;
}
</style>
