<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="item">
            <div class="item-header">
              访问量
              <div class="header-font day">
                日
              </div>
            </div>
            <div class="item-body">
              <div class="big-font">25,848</div>
              <div class="body-til">
                总访问量
                <span>280万</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="item">
            <div class="item-header">
              销售额
              <div class="header-font month">
                月
              </div>
            </div>
            <div class="item-body">
              <div class="big-font">12,000</div>
              <div class="body-til">
                总销售额
                <span>68万</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="item">
            <div class="item-header">
              订单量
              <div class="header-font week">
                周
              </div>
            </div>
            <div class="item-body">
              <div class="big-font">1,680</div>
              <div class="body-til">
                转化率
                <span>60%</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="item">
            <div class="item-header">
              新增用户
              <div>
                <i class="el-icon-warning-outline"></i>
              </div>
            </div>
            <div class="item-body">
              <div class="big-font">128</div>
              <div class="body-til">
                总用户
                <span>10800 人</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="echarts">
      <!-- 订单统计 -->
      <div class="order-main">
        <div>
          <span>订单统计</span>
        </div>
        <div id="order" style="width: 100%;height:400px;"></div>
      </div>

      <!-- 销售分类占比 -->
      <div class="sale-main">
        <div>
          <span>销售分类占比</span>
        </div>
        <div id="sale" style="width: 100%;height:400px;"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  mounted () {
    this.orderInit()
    this.saleInit()
  },
  methods: {
    // 订单统计
    orderInit () {
      // 初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('order'))

      // 指定图表的配置项和数据
      var option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['支付金额', '成交金额']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '01',
              '02',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
              '20',
              '21',
              '22',
              '23',
              '24',
              '25',
              '26',
              '27',
              '28',
              '29',
              '30',
              '31'
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '支付金额',
            type: 'bar',
            barWidth: '40%',
            data: [
              10,
              52,
              200,
              334,
              1390,
              330,
              220,
              0,
              0,
              0,
              15,
              35,
              455,
              21,
              3,
              5,
              45,
              0,
              55,
              0, 59, 50, 6, 2, 0, 11, 12, 0, 455
            ]
          },
          {
            name: '成交金额',
            type: 'bar',
            color: '#5CCCCD'
          }
        ]
      }

      myChart.setOption(option)
    },
    // 销售分类占比
    saleInit () {
      // 初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('sale'))

      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: ['宠物用品', '个护彩妆', '母婴童装', '家居家纺']
        },
        series: [
          {
            name: '数据统计',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            data: [
              { value: 17, name: '宠物用品' },
              { value: 30, name: '个护彩妆' },
              { value: 22, name: '母婴童装' },
              { value: 25, name: '家居家纺' }
            ]
          }
        ]
      }

      myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.bg-purple {
  background-color: #fff;
  border-radius: 4px;
  font-size: 14px;
  color: #595959;
  .item {
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 43px;
      padding: 0 15px;
      border-bottom: 1px solid #f6f6f6;
      .header-font {
        width: 24px;
        height: 18px;
        text-align: center;
        line-height: 18px;
      }
      .day {
        background-color: #f6ffed;
        color: #52c41a;
        border: 1px solid #b7eb8f;
      }
      .month {
        background-color: #e6f7ff;
        color: #1890ff;
        border: 1px solid #91d5ff;
      }
      .week {
        background-color: #fff1f0;
        color: #f5222d;
        border: 1px solid #ffa39e;
      }
    }
    .item-body {
      padding: 10px 15px;
      font-size: 36px;
      .big-font {
        padding: 5px 0 10px 0;
      }
      .body-til {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
      }
    }
  }
}
.echarts {
  display: flex;
  .order-main {
    flex: 3;
    margin-top: 10px;
    margin-right: 10px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    #order {
    }
  }
  .sale-main {
    flex: 1.02;
    margin-top: 10px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
  }
}
</style>
