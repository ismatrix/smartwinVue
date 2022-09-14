<script>
import { socketsStore } from "@/stores/socket";
import { FundService } from "@/utils/api.js";
export default {
  data() {
    const funds = []
    const socket = socketsStore().fundsSocket;
    return {
      initDone: false,
      socket,
      count: 2,
      funds
    };
  },
  created() {
    socketsStore().baseSocket.emit(
      "setToken",
      { token: localStorage.token },
      (res) => {
        console.log(res);
      }
    );
    console.log(this.initDone)
  },
  methods: {
    test() {
      // console.log(this.funds)
      FundService.netvalue('121429', {tradingday: '20220825'}).then(nv => {
        console.log(nv.netValues.netvalue)
      })
    },
    calcFontColor(chg) {
      switch(chg) {
        case 'Up':
          return 'font-red'
        case 'Down':
          return 'font-green'
        default:
          return ''
      }
    },
    calcBgColor(pnl) {
      if (pnl == undefined) return ''
      if (pnl >= 0) return  'cell-pnl-bg-red'
      if (pnl < 0) return 'cell-pnl-bg-green'
    }
  },
  mounted() {
    this.socket.emit('unsubscribe', {fundid: 'all', eventName: "combinedReport"}, res => {
      console.log(res)
    })

    this.socket.on('combinedReport', res => {
      // console.log(res)
      let fund = this.funds.find(f => f.fundid == res.netValueAndEquityReport.fundid)
      if (!fund) return
      let tickChg = res.netValueAndEquityReport.netvalue.last - fund.currentLastNetvalue
      if (tickChg > 0) {
        fund.tickNetvalueChg = 'Up'
      } else if (tickChg < 0) {
        fund.tickNetvalueChg = 'Down'
      }
      
      fund.currentLastNetvalue = res.netValueAndEquityReport.netvalue.last
      fund.currentClosePnl = res.netValueAndEquityReport.netvalue.last - fund.prevCloseNetvalue
      fund.currentSettlePnl = res.netValueAndEquityReport.netvalue.last - fund.prevSettleNetvalue
      fund.positionsLevel = res.positionsLevelReport.total
      fund.positionsLeverage = res.positionsLeverageReport.total
      fund.netting = res.positionsLevelReport.net
      fund.currentDrawdown = res.allPeriodsDrawdownReport.today.currentDrawdown
      fund.historyDrawdown = res.allPeriodsDrawdownReport.history.currentDrawdown
    })

    FundService.fundlist().then(res => {
      let funds = res.funds.filter(i => i.state == 'online')
      // console.log(this.funds)

      funds.forEach(f => {
        let i_fund = {}
        i_fund['fundid'] = f.fundid
        i_fund['fundname'] = f.fundname
        i_fund['brokername'] = f.trading.brokername
        i_fund['issuedate1'] = f.issuedate1

        FundService.tradingdays(f.fundid, {tradingdayCount:2}).then(td => {
          i_fund['prevTradingday'] = td.tradingdays[0]
          i_fund['currentTradingday'] = td.tradingdays[1]
          FundService.netvalue(f.fundid, {tradingday: td.tradingdays[0]}).then(nv => {
            i_fund['prevCloseNetvalue'] = nv.netValues.netvalue.close;
            i_fund['prevSettleNetvalue'] = nv.netValues.netvalue.last;
            // f.currentLastNetvalue = nv.netValues.netvalue.last;
            // f.currentClosePnl = f.currentLastNetvalue - f.prevCloseNetvalue
            // f.currentSettlePnl = f.currentLastNetvalue - f.prevSettleNetvalue
            i_fund['positionsLevel'] = 0
            i_fund['positionsLeverage'] = 0
            i_fund['netting'] = 0
            i_fund['currentDrawdown'] = 0
            i_fund['historyDrawdown'] = 0
            i_fund['tickNetvalueChg'] = ''
            
            FundService.netvalue(f.fundid, {tradingday: td.tradingdays[1]}).then(curNv => {
              i_fund['currentLastNetvalue'] = curNv.netValues.netvalue.last;
              i_fund['currentClosePnl'] = i_fund['currentLastNetvalue'] - i_fund['prevCloseNetvalue']
              i_fund['currentSettlePnl'] = i_fund['currentLastNetvalue'] - i_fund['prevSettleNetvalue']

              this.funds.push(i_fund)
              this.funds.sort((a, b) => {
                let x = new Date(a['issuedate1'])
                let y = new Date(b['issuedate1'])
                // return ((x < y) ? -1 : ((x > y) ? 1 : 0))
                if (x>y) {
                  return 1
                } else if (x < y) {
                  return -1
                } else {
                  return ((a['fundname'] < b['fundname']) ? -1 : ((a['fundname'] > b['fundname']) ? 1 : 0))
                }
              })

              console.log(this.socket.connected)
              this.socket.emit('subscribe', {fundid:f.fundid, eventName: "combinedReport"}, res => {
                console.log(res)
              })
            })

          })
        })
      })
    })
  },
  unmounted() {
    console.log("unmounted");
    // this.socket.removeAllListeners()
    this.socket.off('combinedReport')
    this.funds = []
  },
};
</script>

<template>
  {{ count }}
  <el-button type="primary" @click="test">Primary</el-button>
  <el-table :data="funds" style="width: 100%" v-if="funds.length>0">
    <el-table-column type="index" width="50" />
    <el-table-column prop="fundname" label="基金名称" width="180">
      <template v-slot={row}>
        <router-link :to="'/fundpro/' + row.fundid" >
          <span class="cell-fundname">{{ row.fundname }}</span>
        </router-link>
      </template>
    </el-table-column>
    <el-table-column prop="brokername" label="" width="180">
      <template v-slot={row}>
          <span class="cell-broker">{{ row.brokername }}</span>
        </template>
    </el-table-column>
    <el-table-column prop="currentLastNetvalue" label="净值">
      <template v-slot={row}>
        <div :class="calcFontColor(row.tickNetvalueChg)">
          {{ row.currentLastNetvalue&&row.currentLastNetvalue.toFixed(4) }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="currentClosePnl" label="今日收益(收)">
      <template v-slot={row}>
          <div class="cell-pnl" :class="calcBgColor(row.currentClosePnl)">
            {{ (row.currentClosePnl*100).toFixed(2) }}%
          </div>
        </template>
    </el-table-column>
    <el-table-column prop="positionsLevel" :formatter="(row, col, value, index) => (value*100).toFixed(2)+'%'" label="仓位" />
    <el-table-column prop="positionsLeverage" :formatter="(row, col, value, index) => (value*100).toFixed(2)+'%'" label="杠杆率" />
    <el-table-column prop="netting" :formatter="(row, col, value, index) => (value*100).toFixed(2)+'%'" label="轧差" />
    <el-table-column prop="currentSettlePnl" :formatter="(row, col, value, index) => (value*100).toFixed(2)+'%'" label="今日收益(结)">
      <template v-slot={row}>
          <div class="cell-pnl" :class="calcBgColor(row.currentSettlePnl)">
            {{ (row.currentSettlePnl*100).toFixed(2) }}%
          </div>
        </template>
    </el-table-column>
    <el-table-column prop="currentDrawdown" :formatter="(row, col, value, index) => value.toFixed(2)+'%'" label="今日回撤" />
    <el-table-column prop="historyDrawdown" :formatter="(row, col, value, index) => value.toFixed(2)+'%'" label="累计回撤" />
    <el-table-column prop="" label="更新时间" />
  </el-table>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
<style>
.cell-fundname {
  text-shadow: none;
  color: #337ab7;
  text-decoration: none;
  background-color: transparent;
}
.cell-broker {
  font-size: 12px;
  text-shadow: none!important;
  font-weight: 300;
  padding: 3px 6px;
  color: #fff!important;
  background: #2f353b!important;
  vertical-align: baseline;
  border-radius: .25em;
}
.cell-pnl {
  padding: 5px 10px;
  text-align: right;
  color: white;
}
.cell-pnl-bg-red {
  background: #e7505a!important;
}
.cell-pnl-bg-green {
  background: #26C281 !important;
}
.font-red {
  color: #e7505a!important;
}
.font-green {
  color: #26C281 !important;
}


</style>
