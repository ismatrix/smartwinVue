<script>
import IndChart from "@/components/charts/IndChart.vue";
import { IndService, MDService } from "@/utils/api.js";
import { MoreFilled } from "@element-plus/icons-vue";

export default {
  name: "Ind",
  props: {},
  components: {
    IndChart,
    MoreFilled,
  },
  data() {
    const spotData = {
      activeIndex: 0,
      activeTitle: "国内铁矿石港口存量",
      data: [
        {
          title: "国内铁矿石港口存量",
          startDate: "20210101",
          endDate: "20300101",
          symbol: "iIDX",
          resolution: "day",
          id: "43",
          quote_name: "iIDX期货主连价格",
          series: [],
        },
        {
          title: "国内螺纹钢社会库存量",
          startDate: "20210101",
          endDate: "20300101",
          symbol: "rbIDX",
          resolution: "day",
          id: "67",
          quote_name: "rbIDX期货主连价格",
          series: [],
        },
        {
          title: "国内线材社会库存量",
          startDate: "20210101",
          endDate: "20300101",
          symbol: "rbIDX",
          resolution: "day",
          id: "68",
          quote_name: "rbIDX期货主连价格",
          series: [],
        },
        {
          title: "钢铁行业PMI指数",
          startDate: "20210101",
          endDate: "20300101",
          symbol: "rbIDX",
          resolution: "day",
          id: "118",
          quote_name: "rbIDX期货主连价格",
          series: [],
        },
        {
          title: "沪螺纹钢社会库存",
          startDate: "20210101",
          endDate: "20300101",
          symbol: "rbIDX",
          resolution: "day",
          id: "72",
          quote_name: "rbIDX期货主连价格",
          series: [],
        },
        {
          title: "沪市终端线螺每周采购量监控",
          startDate: "20210101",
          endDate: "20300101",
          symbol: "rbIDX",
          resolution: "day",
          id: "74",
          quote_name: "rbIDX期货主连价格",
          series: [],
        },
        {
          title: "国内主要城市热轧卷板库存",
        },
        {
          title: "唐山地区钢坯库存量",
        },
        {
          title: "波罗的海干散货指数(BDI)",
        },
        {
          title: "国内主要城市冷轧卷板库存",
        },
        {
          title: "全国主要钢材品种库存总量",
        },
        {
          title: "北向资金",
        },
        {
          title: "上证指数",
        },
      ],
    };

    const bullbear = [];
    const bullbear_date = [];
    const bullbear_loading = true;

    const news = [];
    return { spotData, bullbear, bullbear_date, bullbear_loading, news };
  },
  created() {
    // spot chart
    let chartData = this.spotData.data;
    for (let i = 0; i < 6; i++) {
      let params_q = {
        endDate: chartData[i].endDate,
        symbol: chartData[i].symbol,
        resolution: chartData[i].resolution,
        startDate: chartData[i].startDate,
      };
      IndService.quotes(params_q).then((res) => {
        let data = [];
        res.quotes.forEach((i) => {
          data.push([this.parseDate(i.tradingday), i.close.toFixed(2)]);
        });

        let params_s = {
          enddate: chartData[i].endDate,
          id: chartData[i].id,
          startdate: chartData[i].startDate,
        };
        IndService.spotdata(params_s).then((res_s) => {
          let data_s = [];
          res_s.spotdatas.datas.forEach((i) => {
            data_s.push([this.parseDate(i.tradingday), i.data]);
          });
          chartData[i].series[0] = {
            name: chartData[i].quote_name,
            type: "line",
            data,
            showSymbol: false,
            lineStyle: {
              width: 1
            }
          };
          chartData[i].series[1] = {
            name: chartData[i].title,
            type: "line",
            data: data_s,
            showSymbol: false,
            yAxisIndex: 1,
            color: 'red',
            lineStyle: {
              width: 1
            }
          };
        });
      });
    }

    // bull bear
    (async () => {
      let params = {
        projection: {
          productid: 1,
          nickname: 1,
        },
        query: {
          productid: { $in: [] },
        },
      };
      await MDService.productGroups({}).then((res) => {
        res.productGroups.forEach((i) => {
          this.bullbear.push({
            groupname: i.groupname,
            productlist: i.productlist.map((e) => {
              return { productid: e, data: {} };
            }),
          });
          params.query.productid.$in = params.query.productid.$in.concat(
            i.productlist
          );
        });
        params.query.productid.$in = Array.from(
          new Set(params.query.productid.$in)
        );
      });

      await MDService.products(params).then((products) => {
        let map_nickname = new Map();
        products.wildcards.forEach((p) => {
          map_nickname.set(p.productid, p.nickname);
        });
        this.bullbear.forEach((b) => {
          b.productlist.forEach((p) => {
            p.nickname = map_nickname.get(p.productid);
          });
        });
      });

      await IndService.bullbear({ projection: {}, query: {} }).then((res) => {
        let max_tradingdays = res.wildcards.reduce((max, cur) => {
          return cur.tradingday.length > max ? cur.tradingday.length : max;
        });
        let date_group = Array.from(
          new Set(max_tradingdays.tradingday.map((i) => i.slice(0, 6)))
        ); // date group
        this.bullbear_date = date_group;

        res.wildcards.forEach((i) => {
          let productid = i.instrument.slice(0, -3);
          this.bullbear.forEach((bb) => {
            bb.productlist.forEach((p) => {
              if (p.productid == productid) {
                let obj = {};
                this.bullbear_date.forEach((d) => {
                  obj[d] = [];
                });
                for (let j = 0; j < i.tradingday.length; j++) {
                  let td = i.tradingday[j];
                  let v = i.value[j];
                  let group_date = td.slice(0, 6);
                  obj[group_date].push(v);
                }
                p.data = obj;
              }
            });
          });
        });
        this.bullbear_loading = false;
      });
    })();

    // news
    (async () => {
      IndService.news({}).then((res) => {
        // console.log(res)
        res.wildcards.slice(-30).forEach((i) => {
          this.news.push({
            timestamp: i.date,
            content: i.titil,
            // color: '#333'
          });
        });
      });
    })();
  },
  mounted() {},
  methods: {
    spotItemSelect(index) {
      this.spotData.activeIndex = index;
      this.spotData.activeTitle =
        this.spotData.data[this.spotData.activeIndex].title;
    },
    parseDate(str) {
      let y = str.substr(0, 4),
        m = str.substr(4, 2),
        d = str.substr(6, 2);
      return y + "-" + m + "-" + d;
    },
    async test() {
      MDService.productGroups({}).then((res) => {
        console.log("test1");
      });
      console.log("test2");
    },
  },
};
</script>

<template>
  <el-container>
    <el-container>
      <el-main
        class="radius"
        style="
          borderradius: var(--el-border-radius-base);
          border: 1px solid var(--el-border-color);
          margin: 20px;
          overflow: hidden;
        "
      >
        <el-row :gutter="0">
          <!-- <el-col :span="6">
            <div class="panel-heading">现货数据列表</div>
            <el-scrollbar height="420px" always wrap-style="border-bottom: 1px solid var(--el-border-color);">
              <a class="list-group-item" 
                  v-for="(item, index) in spotData.data" :key="item" 
                  @click="spotItemSelect(index)"
                  :class="spotData.activeIndex == index ? 'list-group-item-active': ''">
                {{ item.title }}
              </a>
            </el-scrollbar>
          </el-col> -->
          <el-col :span="8" v-for="n in 3" :key="n">
            <ind-chart
              :title="this.spotData.data[n - 1].title"
              :series="this.spotData.data[n - 1].series"
            />
          </el-col>
        </el-row>
        <el-row :gutter="0" style="margin-top: 20px">
          <el-col :span="8" v-for="n in 3" :key="n">
            <ind-chart
              :title="this.spotData.data[n - 1 + 3].title"
              :series="this.spotData.data[n - 1 + 3].series"
            />
          </el-col>
        </el-row>
        
      </el-main>
      <el-aside width="400px">
        <el-card class="box-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span class="text-large font-600 mr-3">实时快讯</span>
              <el-link
                :underline="false"
                href="https://www.zhitongcaijing.com/immediately.html"
                target="_blank"
              >
                更多
                <el-icon><ArrowRight /></el-icon>
              </el-link>
            </div>
          </template>
          <el-scrollbar height="560px" width="290px" always>
            <el-timeline style="padding: 5px;">
              <el-timeline-item
                v-for="(n, index) in news"
                :key="index"
                :icon="n.icon"
                :type="n.type"
                :color="n.color"
                :size="n.size"
                :hollow="n.hollow"
                :timestamp="n.timestamp"
                
              >
                <!-- {{ n.content }} -->
                <span v-html="n.content"></span>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </el-aside>
    </el-container>
      <el-footer
        class="radius"
        style="
          padding: 0;
          height: auto;
          margin: 20px 50px 20px 20px;
          borderradius: var(--el-border-radius-base);
          border: 1px solid var(--el-border-color);
        "
      >
        <el-scrollbar always v-loading="bullbear_loading">
          <div class="scrollbar-flex-content" v-show="!bullbear_loading">
            <div>
              <el-row style="flex-wrap: nowrap" class="table-row">
                <el-col :span="2" class="table-item"></el-col>
                <el-col :span="2" class="table-item"></el-col>
                <el-col
                  v-for="i in bullbear_date"
                  :key="i"
                  :span="3"
                  class="table-item table-header"
                >
                  {{ i }}
                </el-col>
              </el-row>
              <el-row v-for="i in bullbear" :key="i" style="flex-wrap: nowrap">
                <el-col :span="2" class="table-row-label">
                  <p>{{ i.groupname }}</p>
                </el-col>
                <el-col
                  :span="2"
                  class="table-row-label"
                  style="display: block"
                >
                  <el-row
                    v-for="j in i.productlist"
                    :key="j"
                    class="table-row-label"
                  >
                    <el-col style="padding: 5px; height: 29px">{{ j.nickname }}</el-col>
                  </el-row>
                </el-col>
                <el-col
                  v-for="date in bullbear_date"
                  :key="date"
                  :span="3"
                  class="table-row-label"
                  style="display: block"
                >
                  <el-row
                    v-for="r in i.productlist"
                    :key="r"
                    class="table-row-label row-progress"
                    justify="end"
                  >
                    <div
                      v-for="n in r.data[date]"
                      :key="n"
                      class="col-progress"
                      :style="{
                        width:
                          Math.min(100 / r.data[date].length, 10).toString() +
                          '%',
                        'background-color':
                          n == 1 ? '#D91E18' : n == -1 ? '#26C281' : 'white',
                      }"
                    >
                      &nbsp;
                    </div>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-scrollbar>
      </el-footer>
    
  </el-container>
</template>

<style scoped>
.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color);
  /* width: 400px; */
  height: 420px;
  border-bottom: 1px solid #ddd;
}

.panel-heading {
  color: #e73d4a;
  background-color: #fbe1e3;
  border-color: #fbe1e3;
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
}

.panel-title {
  margin-top: 0;
  font-size: 16px;
}

.list-group {
  height: 400px;
  overflow: scroll;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 10px 15px;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid #ddd;
  font-size: 14px;
}

.list-group-item:hover {
  text-decoration: none;
  color: #555;
  background-color: #f5f5f5;
  cursor: pointer;
}

.list-group-item-active {
  z-index: 2;
  color: #fff;
  background-color: #f35e60;
  border-color: #f35e60;
}
.list-group-item-active:hover {
  background-color: #f35e60;
  border-color: #f35e60;
  color: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 350px;
}

.scrollbar-flex-content {
  display: flex;
}
.table-row {
  text-align: center;
  height: 36px;
}
.table-row-label {
  display: flex;
  border-right: 1px solid #dddddd;
  text-align: center;
  vertical-align: middle;
  align-items: center;
  border-bottom: 1px solid #dddddd;
  font-size: 14px;
}
p {
  width: 100%;
}
.table-item {
  text-align: center;
  border-right: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
  vertical-align: middle;
}
.table-header {
  font-weight: bold;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  text-align: center;
  color: #333;
  font-size: 14px;
}

.row-progress {
  /* justify-content: flex-end; */
}
.col-progress {
  padding: 5px 0px;
}
.font-600 {
  font-weight: 600;
}
.mr-3 {
  margin-right: 0.76rem;
}
</style>
