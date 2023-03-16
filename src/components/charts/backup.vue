<script>
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
  name: "BasicLineChart",
  components: {
    VChart,
  },
  provide: {
    // [THEME_KEY]: "dark",
  },
  props: ["title", "data"],
  data() {
    let option = ref({
      title: {
        text: this.title,
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Email", "Union Ads", "Direct"],
        // bottom: "-10",
        // padding: -10
        top: "bottom"
      },
      grid: {
        // left: "3%",
        // right: "4%",
        // bottom: "3%",
        // containLabel: true,
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {},
      //   },
      // },
      xAxis: {
        type: "time",
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Email",
          type: "line",
          data: [['2022-01-02', 220], ['2022-02-03', 182], ['2022-03-04', 191], ['2022-04-05', 234], ['2022-05-06', 290], ['2022-06-07', 330], ['2022-07-08', 310]],
        },
        {
          name: "Union Ads",
          type: "line",
          data: [['2022-01-02', 150], ['2022-02-03', 232], ['2022-03-04', 201], ['2022-04-05', 154], ['2022-05-06', 190], ['2022-06-07', 330], ['2022-07-08', 410]],
        },
        {
          name: "Direct",
          type: "line",
          data: [['2022-01-02', 820], ['2022-02-03', 932], ['2022-03-04', 901], ['2022-04-05', 934], ['2022-05-06', 1290], ['2022-06-07', 1330], ['2022-07-08', 1320]],
        },
        // {
        //   name: "Direct",
        //   type: "line",
        //   data: [320, 332, 301, 334, 390, 330, 320],
        // },
        // {
        //   name: "Search Engine",
        //   type: "line",
        //   data: [820, 932, 901, 934, 1290, 1330, 1320],
        // },
      ],
    });
    return {
      option,
      stitle: '1'
    };
  },
  watch: {
    title(newValue, oldValue) {
      this.option.title.text = newValue
    },
  },
  created() {
    this.option.title.text = this.title
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
      // return m + "/" + d + "/" + y;
      return y + "-" + m + "-" + d;
    },
    test() {
       this.option.title.text = 'aasd'
    }
  },
};
</script>

<template>
  <v-chart class="chart" :option="option" :init-options='{locale: "ZH", height: "auto"}'/>
</template>



<style scoped>
.chart {
  /* height: 500px; */
}
</style>
