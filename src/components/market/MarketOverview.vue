<script>
import { MDService } from "@/utils/api.js";
import { socketsStore } from "@/stores/socket";
import { ref } from 'vue'

export default {
  data() {
    const sockets = socketsStore();
    sockets.baseSocket.emit(
      "setToken",
      { token: localStorage.token },
      (res) => {
        console.log(res);
      }
    );
    sockets.marketsSocket.emit(
      "unsubscribe",
      { type: "futures", symbol: "all", resolution: "tick" },
      (res) => {
        console.log("unsubscribe " + JSON.stringify(res));
      }
    );
    return {
      loading: ref(true),
      sockets,
      fetchDone: false,
      productGroups: [],
      contracts: [],
      instrumentids: [],
      lastSnapshots: [],
      groupsPlate: [
        {
          name: "股指",
          lists: [
            {
              name: "沪深指数",
              code: "IF",
              instrumentid: "IF2209",
              close: 4000,
              preClose: 3900,
              chg: "0.5%",
            },
          ],
        },
      ],
      groups: [],
    };
  },
  mounted() {
    MDService.productGroups().then((res) => {
      // res.productGroups = res.productGroups.slice(0, 5)
      // res.productGroups[0].productlist = ['IC']
      this.productGroups = res.productGroups;
      res.productGroups.forEach((e) => {
        let obj = {};
        obj.name = e.groupname;
        obj.lists = [];
        e.productlist.forEach((p) => {
          let pobj = {};
          pobj.code = p;
          obj.lists.push(pobj);
        });
        this.groups.push(obj);
      });
      // console.log(this.groups)
      // let parameters={
      //     "products": $scope.productList,
      //     "ranks": [1],
      //     "productClasses": ["1"],
      //     "isTrading":[1]
      //   };
      this.getHotContracts(res.productGroups);
    });

    // this.sockets.marketsSocket.off("tick");
    this.sockets.marketsSocket.on("tick", (res) => {
      // console.log(res)
      for (let index = 0; index < this.groups.length; index++) {
        let symbol = this.groups[index].lists.find(
          (i) => i.instrumentid == res.symbol
        );
        if (symbol) {
          symbol.close = res.price;
          symbol.chg = this.calcChg(symbol);
          if (this.loading) this.loading = false
          break;
        }
      }
      // console.log(res.symbol, res.timestamp)
    });
  },
  methods: {
    getHotContracts(productGroups) {
      let productList = [];
      productGroups.forEach((e) => {
        e.productlist.forEach((product) => {
          productList.push(product);
        });
      });
      productList = Array.from(new Set(productList)); // ['IF', 'IC', 'rb'...]
      let params = {
        products: productList,
        ranks: [1],
        productClasses: ["1"],
        isTrading: [1],
      };
      MDService.hotContracts(params).then((res) => {
        this.contracts = res.contracts;
        this.groups.forEach((g) => {
          g.lists.forEach((p) => {
            let c = res.contracts.filter(
              (contract) => contract.productid == p.code
            )[0];
            p.instrumentid = c.instrumentid;
            p.name = this.getInstrumentName(c.instrumentname, c.productid);
          });
        });
        this.instrumentids = res.contracts.map((x) => x.instrumentid);
        this.getLastSnapshots(this.instrumentids);
      });
    },
    getInstrumentName(instrumentname, productID) {
      if (productID == "IF") return "沪深300";
      if (productID == "IH") return "上证50";
      if (productID == "IC") return "中证500";
      if (productID == "IM") return "中证1000";
      if (productID == "ru") return "橡胶";
      if (productID == "a") return "黄豆一";
      if (productID == "b") return "黄豆二";
      if (productID == "l") return "塑料";
      if (productID == "TA") return "PTA";
      if (productID == "WH") return "小麦";
      if (productID == "v") return "PVC";
      if (productID == "nr") return "20号胶";
      if (productID == "sp") return "纸浆";
      return instrumentname.replace(/\d+/g, "");
    },
    getInstrumentID(productID) {
      let instrumentID = this.contracts.filter(
        (item) => item.productid == productID
      );
      return instrumentID.length > 0 ? instrumentID[0].instrumentid : "";
    },
    getLastSnapshots(instrumentids) {
      let params = { symbols: this.instrumentids };
      MDService.lastSnapshot(params).then((res) => {
        res.lastSnapshot.forEach((snapshot) => {
          snapshot.instrument;
        });
        this.groups.forEach((g) => {
          g.lists.forEach((p) => {
            let snapshot = res.lastSnapshot.filter(
              (i) => i.instrument == p.instrumentid
            )[0];
            Object.assign(p, snapshot);
            p.chg = this.calcChg(p);
          });
        });
        this.lastSnapshots = res.lastSnapshot;
        this.instrumentids.forEach((i) => {
          this.subscribeTick(i);
          // console.log('subscribe tick')
          if (this.loading) this.loading = false
        });
      });
      
    },
    getLastSnapshot(instrumentid) {
      let snapshot = this.lastSnapshots.filter(
        (item) => item.instrument == instrumentid
      );
      return snapshot.length > 0 ? snapshot[0] : {};
    },
    subscribeTick(instrumentid) {
      this.sockets.marketsSocket.emit(
        "subscribe",
        { type: "futures", symbol: instrumentid, resolution: "tick" },
        (res) => {
          // console.log(res)
        }
      );
    },
    calcChg(symbol) {
      let chg =
        Math.round(
          ((symbol.close - symbol.preclose) / symbol.preclose) * 10000
        ) / 100;
      return chg.toFixed(2);
    },
    calcBackgroundColor(symbol) {
      let chg = ((symbol.close - symbol.preclose) / symbol.preclose) * 100;
      const upColor = [
        "#F5B7B1",
        "#F1948A",
        "#EC7063",
        "#E74C3C",
        "#CB4335",
        "#B03A2E",
        "#943126",
        "#78281F",
        "#641E16",
      ];
      const downColor = [
        "#ABEBC6",
        "#82E0AA",
        "#58D68D",
        "#2ECC71",
        "#28B463",
        "#239B56",
        "#1D8348",
        "#186A3B",
        "#145A32",
      ];

      if (chg > 0 && chg < 0.5) return upColor[0];
      if (chg >= 0.5 && chg < 1.0) return upColor[1];
      if (chg >= 1.0 && chg < 1.5) return upColor[2];
      if (chg >= 1.5 && chg < 2.0) return upColor[3];
      if (chg >= 2.0 && chg < 3.0) return upColor[4];
      if (chg >= 3.0 && chg < 4.0) return upColor[5];
      if (chg >= 4.0 && chg < 5.0) return upColor[6];
      if (chg >= 5.0 && chg < 6.0) return upColor[7];
      if (chg >= 6.0) return upColor[8];

      if (chg < 0 && chg > -0.5) return downColor[0];
      if (chg <= -0.5 && chg > -1.0) return downColor[1];
      if (chg <= -1.0 && chg > -1.5) return downColor[2];
      if (chg <= -1.5 && chg > -2.0) return downColor[3];
      if (chg <= -2.0 && chg > -3.0) return downColor[4];
      if (chg <= -3.0 && chg > -4.0) return downColor[5];
      if (chg <= -4.0 && chg > -5.0) return downColor[6];
      if (chg <= -5.0 && chg > -6.0) return downColor[7];
      if (chg <= -6.0) return downColor[8];
      return "#F5F5F5";
    },
    calcTxtColor(symbol) {
      let chg = ((symbol.close - symbol.preclose) / symbol.preclose) * 100;
      const upColor = ["#F1948A", "#943126"];
      const downColor = ["#82E0AA", "#1D8348"];
      if (chg > 0 && chg <= 1.5) return upColor[1];
      if (chg > 1.5) return upColor[0];

      if (chg < 0 && chg >= -1.5) return downColor[1];
      if (chg < -1.5) return downColor[0];

      return "#943126";
    },
    test() {
      this.groups[2].lists[1].close += 10;
      console.log(this.groups[2].lists[1].close);
    },
  },
};
</script>

<template>
<el-skeleton style="width: 100%" :loading="loading" animated>
  <template #template>
    <div style="padding: 20px">
      <el-skeleton-item variant="p" style="width: 33%; height: 100px" />
      <el-skeleton-item variant="p" style="width: 100%; height: 100px" />
      <el-skeleton-item variant="p" style="width: 100%; height: 100px" />
      <el-skeleton-item variant="p" style="width: 66%; height: 100px" />
    </div>
  </template>

  <template #default>
    <el-button type="primary" @click="test">Primary</el-button>
    <el-row v-for="group in groups" :key="group.id">
      <el-col :span="2" class="elCol elCol-category">
        <p>{{ group.name }}</p>
      </el-col>
      <el-col
        v-for="symbol in group.lists"
        :key="symbol.id"
        :span="3"
        class="elCol elCol-item"
        :style="{'backgroundColor': calcBackgroundColor(symbol), 'color': calcTxtColor(symbol)}"
      >
        <p><strong>{{ symbol.name }}</strong></p>
        <p><h2>{{ symbol.chg }}%</h2></p>
        <p>{{ symbol.instrumentid }}</p>
      </el-col>
    </el-row>
  </template>
</el-skeleton>
</template>

<style scoped>
.elCol {
  /* display: flex; */
  height: 150px;
  padding: 8px;
  align-items: center;
}
.elCol-category {
  background-color: var(--el-color-info-light-7);
}
.elCol-item {
  border: 1px solid var(--el-border-color);
}
.el-col p {
  text-align: center;
  width: 100%;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
