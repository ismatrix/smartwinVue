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
  name: "IndChart",
  components: {
    VChart,
  },
  provide: {
    // [THEME_KEY]: "dark",
  },
  props: ["title", "series"],
  data() {
    let option = ref({
      title: {
        text: this.title,
        // show: false,
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        // data: ["Email", "Union Ads", "Direct"],
        // bottom: "-10",
        // padding: -10
        top: "bottom"
      },
      grid: {
        // left: "3%",
        // right: "4%",
        // bottom: "3%",
        // containLabel: true,
        // show: false
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {},
      //   },
      // },
      // color: [
      //   '#c23531',
      //   '#2f4554',
      //   '#61a0a8',
      //   '#d48265',
      //   '#91c7ae',
      //   '#749f83',
      //   '#ca8622',
      //   '#bda29a',
      //   '#6e7074',
      //   '#546570',
      //   '#c4ccd3'
      // ],
      xAxis: {
        type: "time",
        boundaryGap: false,
      },
      // yAxis: {
      //   type: "value",
      // },
      yAxis: [{type: "value", splitLine: false}, {type: "value", splitLine: false}],
      series: [],
    });
    return {
      option,
      loading: false
    };
  },
  watch: {
    title(newValue, oldValue) {
      
    },
    series: {
      handler(newValue, oldValue) {
        this.loading = false;
      },
      deep: true
    }
  },
  created() {
    this.option.title.text = this.title

    this.option.series = this.series
  },
  methods: {
    test() {
       this.option.title.text = 'aasd'
    }
  },
};
</script>

<template>
  <v-chart class="chart" :option="option" :init-options='{locale: "ZH", height: "300", width: "auto"}' :loading=this.loading />
</template>



<style scoped>
.chart {
  /* height: 500px; */
}
</style>
