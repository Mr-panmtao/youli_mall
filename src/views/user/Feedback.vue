<template>
  <div class="body">
    <el-table
      ref="multipleTable"
      :data="feedbackList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        prop="nickName"
        width="150"
        label="反馈用户"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="contacts"
        width="150"
        label="联系人"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="contact_information"
        label="联系方式"
        width="240"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="content"
        label="反馈信息"
        width="350"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="feedback_img"
        label="相关图片"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            <el-image
              v-for="(item, index) in scope.row.feedback_img"
              :key="index"
              style="width: 60px; height: 60px;margin:0 5px"
              :src="item.url"
            ></el-image>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="feedback_time"
        label="反馈时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.feedback_time | dateFormat }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="feedbackInfo.pageNum"
      background
      :page-sizes="[1, 2, 5, 10]"
      :page-size="feedbackInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      feedbackList: [],
      total: 0,
      // page
      feedbackInfo: {
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  created () {
    this.getFeedback()
  },
  methods: {
    // 获取反馈信息
    async getFeedback () {
      const { data: res } = await this.$axios.post(
        'getFeedback',
        this.feedbackInfo
      )
      this.feedbackList = res.data
      this.total = res.total
    },
    // 页大小发生改变
    handleSizeChange (pageSize) {
      this.feedbackInfo.pageSize = pageSize
      this.getFeedback()
    },
    // 当前页发生改变
    handleCurrentChange (pageNum) {
      this.feedbackInfo.pageNum = pageNum
      this.getFeedback()
    }
  }
}
</script>
