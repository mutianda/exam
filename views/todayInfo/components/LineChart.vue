<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '190px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      const series = []
      const colors = [
        '#B10A17',
        '#B10A17',
        '#FF005A',
        '#8DFF19',
        '#267611',
        '#49a9ab',
        '#0E0943',
        '#C18C16',
        '#BF93C8',
        '#870a14',
        '#874116',
        '#681B68',
        '#C18C16',
        '#BF93C8',
        '#267611'

      ]
      for (const i in colors) {
        const item = {
          name: 'expected', itemStyle: {
            normal: {
              color: colors[i - 1],
              lineStyle: {
                color: colors[i - 1],
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: data['line' + i],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }
        series.push(item)
      }
      console.log(series)

      this.chart.setOption({
        xAxis: {
          data: data.line0,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [
          ...series
        ]

      })
    }
  }
}
</script>
