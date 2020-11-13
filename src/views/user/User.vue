<template>
  <div>
    <div class="header">
      <el-input
        class="mar"
        size="small"
        placeholder="用户昵称"
        v-model="userInfo.nickName"
        clearable
        style="width:150px"
      >
      </el-input>
      <el-input
        size="small"
        placeholder="手机号"
        v-model="userInfo.phone"
        clearable
        style="width:150px"
      >
      </el-input>
      <el-select
        class="mar"
        size="small"
        style="width:150px"
        v-model="userInfo.state"
        placeholder="所有状态"
        clearable
      >
        <el-option label="正常" value="1"> </el-option>
        <el-option label="封禁" value="0"> </el-option>
      </el-select>
      <el-button
        @click="getUser"
        size="small"
        type="primary"
        icon="el-icon-search"
        >搜索</el-button
      >
    </div>

    <div class="body">
      <el-table
        ref="multipleTable"
        :data="userList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" prop="id" label="编号" width="50">
        </el-table-column>
        <el-table-column
          align="center"
          prop="nickName"
          label="用户昵称"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="手机号"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="sex"
          label="性别"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.sex === 1">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          align="center"
          prop="register_time"
          label="注册时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.register_time | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          align="center"
          prop="login_last"
          label="最后登录"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.login_last | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="balance"
          label="账户余额"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="order_count"
          sortable
          label="下单次数"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="deal_count"
          sortable
          label="成交次数"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="use_total"
          sortable
          label="消费总额"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="activity"
          sortable
          label="活跃度"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column align="center" label="用户状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              :active-value="1"
              :inactive-value="0"
              @change="stateChange(scope.row)"
            >
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-view"
              type="primary"
              plain
              @click="viewUser(scope.row, 1)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="viewUser(scope.row)"
              >充值</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pageNum"
        background
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 查看用户信息 -->
    <el-dialog title="用户信息详情" :visible.sync="dialogUserInfo" width="30%">
      <div class="user-info">
        <span class="til">用户编号：</span> {{ userObj.id }}
      </div>
      <div class="user-info">
        <span class="til">用户昵称：</span> {{ userObj.nickName }}
      </div>
      <div class="user-info">
        <span class="til">性别：</span> <span v-if="userObj.sex === 1">男</span
        ><span v-else>女</span>
      </div>
      <div class="user-info">
        <span class="til">手机号：</span> {{ userObj.phone }}
      </div>
      <div class="user-info">
        <span class="til">注册时间：</span>
        {{ userObj.register_time | dateFormat }}
      </div>
      <div class="user-info">
        <span class="til">最后登录：</span>
        {{ userObj.login_last | dateFormat }}
      </div>
      <div class="user-info">
        <span class="til">账户余额：</span> {{ userObj.balance }}
      </div>
      <div class="user-info">
        <span class="til">下单次数：</span> {{ userObj.order_count }}
      </div>
      <div class="user-info">
        <span class="til">成交次数：</span> {{ userObj.deal_count }}
      </div>
      <div class="user-info">
        <span class="til">消费总额：</span> {{ userObj.use_total }}
      </div>
      <div class="user-info">
        <span class="til">活跃度：</span> {{ userObj.activity }}
      </div>
      <div class="user-info">
        <span class="til">用户状态：</span>
        <span v-if="userObj.state === 1">正常</span><span v-else>已封禁</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogUserInfo = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <!-- 充值金额 -->
    <el-dialog title="用户余额充值" :visible.sync="dialogmoney" width="30%">
      <span>充值金额：</span>
      <el-input-number
        v-model="userObj.balance"
        :min="userObj.balance"
        label="描述文字"
      ></el-input-number>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogmoney = false">取 消</el-button>
        <el-button type="primary" @click="Recharge">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 查询用户列表数据对象
      userInfo: {
        nickName: '',
        phone: '',
        state: '',
        pageNum: 1,
        pageSize: 5
      },
      //   用户列表数据
      userList: [],
      total: 0,

      // 用户数据对象
      userObj: {},

      // 查看用户信息 modal
      dialogUserInfo: false,
      // 充值金额
      dialogmoney: false
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    // 获取用户列表
    async getUser () {
      const { data: res } = await this.$axios.post('getUser', this.userInfo)
      this.userList = res.data
      this.total = res.total
    },
    // 页大小发生改变
    handleSizeChange (pageSize) {
      this.userInfo.pageSize = pageSize
      this.getUser()
    },
    // 当前页发生改变
    handleCurrentChange (pageNum) {
      this.userInfo.pageNum = pageNum
      this.getUser()
    },

    // 查看用户信息
    viewUser (item, type) {
      this.userObj = item
      // 查看用户信息
      if (type === 1) {
        this.dialogUserInfo = true
      } else {
        // 充值金额
        this.dialogmoney = true
      }
    },

    // 编辑用户状态
    async stateChange (item) {
      const { data: res } = await this.$axios.post('updateUser', item)
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
      this.getUser()
    },

    // 充值金额
    async Recharge () {
      const { data: res } = await this.$axios.post('updateUser', this.userObj)
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
      this.getUser()
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  .mar {
    margin: 0 10px;
  }
}
.user-info {
  margin: 15px;
  font-size: 15px;
  .til {
    display: inline-block;
    width: 100px;
    margin-right: 15px;
    text-align: right;
  }
}
</style>
