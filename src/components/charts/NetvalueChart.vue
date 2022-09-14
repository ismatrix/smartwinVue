<script>
import { FundService } from "@/utils/api.js";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  MarkLineComponent,
  MarkPointComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, defineComponent } from "vue";

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  MarkLineComponent,
  MarkPointComponent,
]);

export default {
  name: "NetvalueChart",
  props: ["fundid"],
  components: {
    VChart,
  },
  provide: {
    // [THEME_KEY]: "dark",
  },
  data() {
    let option = ref({
      tooltip: {
        trigger: "axis",
        show: true,
      },
      grid: [
        {
          left: "5%",
          right: "5%",
          height: "60%",
        },
        {
          left: "5%",
          right: "5%",
          // top: '63%',
          bottom: "10",
          height: "16%",
        },
      ],
      axisPointer: {
        link: [
          {
            xAxisIndex: [0, 1],
          },
        ],
      },
      xAxis: [
        {
          type: "category",
          data: [],
          splitLine: {
            show: false,
          },
        },
        {
          type: "category",
          gridIndex: 1,
          data: [],
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: "dataMin",
          max: "dataMax",
        },
      ],
      yAxis: [
        {
          type: "value",

          // min: (v) => v.min - 0.1,
          // max: (v) => v.max + 0.1,
          scale: true,
          splitNumber: 4,
          // minInterval: 0.1
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          xisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      series: [
        {
          name: "综合净值",
          color: "red",
          data: [],
          type: "line",
          showSymbol: false,
          markPoint: {
            data: [
              {
                type: "max",
                name: "Max",
                symbolSize: 0,
                label: {
                  offset: [20, -20],
                  color: "red",
                  fontWeight: "bold",
                  formatter: (params) => params.value.toFixed(4),
                },
              },
              {
                type: "min",
                name: "Min",
                symbolSize: 0,
                label: {
                  offset: [20, 20],
                  color: "green",
                  fontWeight: "bold",
                  formatter: (params) => params.value.toFixed(4),
                },
              },
            ],
          },
          endLabel: {
            show: true,
            fontWeight: "bold",
            offset: [0, -10],
            formatter: (params) => params.value.toFixed(4),
          },
        },
        {
          name: "MA20",
          type: "line",
          color: "orange",
          showSymbol: false,
          smooth: true,
          data: [],
          lineStyle: {
            width: 1,
          },
          tooltip: {
            show: true,
            trigger: "axis",
            valueFormatter: value => value == '-' ? value : value.toFixed(4)
          },
        },
        {
          name: "日回报",
          type: "bar",
          barWidth: "1",
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: [],
          tooltip: {
            show: true,
            trigger: "axis",
            valueFormatter: value => value.toFixed(2) + '%'
          },
          itemStyle: {
            color: (params) => (params.value >= 0 ? "red" : "green"),
          },
        },
      ],
    });
    return {
      option,
    };
  },
  created() {
    FundService.netvalues("121429").then((res) => {
      this.option.xAxis[0].data = res.netLines.map((i) =>
        this.parseDate(i.tradingday)
      );
      this.option.xAxis[1].data = res.netLines.map((i) =>
        this.parseDate(i.tradingday)
      );
      this.option.series[0].data = res.netLines.map((i) => i.netvalue.last);
      this.option.series[2].data = res.netLines.map((i) => i.netvalue.returns);

      this.option.series[1].data = this.calculateMA(
        20,
        res.netLines.map((i) => i.netvalue.last)
      );
    });
  },
  methods: {
    parseDate(str) {
      let y = str.substr(0, 4),
        // m = str.substr(4, 2) - 1,
        m = str.substr(4, 2),
        d = str.substr(6, 2);
      // var D = new Date(y, m, d);
      // return D.getFullYear() == y && D.getMonth() == m && D.getDate() == d
      //   ? D
      //   : "invalid date";
      return m + "/" + d + "/" + y;
    },
    calculateMA(dayCount, data) {
      let result = [];
      for (let i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
          sum += +data[i - j];
        }
        result.push(sum / dayCount);
      }
      return result;
    },
  },
};
</script>

<template>
  <v-chart class="chart" :option="option" />
</template>



<style scoped>
.chart {
  height: 500px;
}
</style>
