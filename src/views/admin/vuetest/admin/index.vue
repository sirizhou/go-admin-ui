<template>
  <div class="dashboard">
    <el-card :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <el-tabs>
          <!-- 切换界面 -->
          <el-tab-pane label="数据">
            <el-row>
              <el-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <line-chart :list="lineData0" title="数据显示" />
              </el-col>
              <el-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <line-chart :list="lineData1" title="数据显示" />
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="访问量">
            <el-row>
              <el-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <lin :list="lineData2" title="销售额趋势" />
              </el-col>
              <!--重复写了一遍 使得切换tab这个不变-->
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList" />
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

  </div>
</template>

<script>
import RankList from '@/components/RankList/index'
import LineChart from '@/components/LineChart.vue'

const lineData1 = []
const lineData0 = []
const lineData2 = []

for (let i = 0; i < 1000; i += 1) {
  lineData0.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
  lineData1.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
  lineData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}

export default {
  name: 'DashboardAdmin',
  components: {
    RankList,
    LineChart
  },
  data() {
    return {
      lineData0,
      lineData1,
      lineData2,
      rankList
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

::v-deep .el-tabs__item{
   padding-left: 16px!important;
   height: 50px;
   line-height: 50px;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
