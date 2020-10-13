<template>
  <div>
    <div class="rights-header">
      <el-button
        @click="dialogVisible = true"
        type="primary"
        size="small"
        icon="el-icon-circle-plus-outline"
        >添加权限</el-button
      >
    </div>
    <div class="rights-body">
      <el-table :data="rights_list"  style="width: 100%" row-key="id">
        <el-table-column
          type="index"
          align="center"
          label="#"
          width="100px"
        ></el-table-column>
        <el-table-column prop="rights_name" align="center" label="权限名称">
        </el-table-column>
        <el-table-column prop="rights_url" align="center" label="路径">
        </el-table-column>
        <el-table-column align="center" label="权限等级">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.r_id === 0">一 级</el-tag>
            <el-tag type="warning" v-if="scope.row.r_id > 0">二 级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加权限modal -->
    <el-dialog
      title="添加权限"
      @close="handleClose"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form
        :model="rightsForm"
        :rules="rightsRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item required label="上级权限" prop="r_id">
          <el-select
            clearable
            v-model="rightsForm.r_id"
            placeholder="请选择活动区域"
          >
            <el-option label="顶级权限" value="0"></el-option>
            <el-option
              v-for="item in rights_list"
              :key="item.id"
              :label="item.rights_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="权限名称" prop="rights_name">
          <el-input
            placeholder="请输入权限名称"
            v-model="rightsForm.rights_name"
          ></el-input>
        </el-form-item>
        <el-form-item required label="权限路径" prop="rights_url">
          <el-input
            placeholder="请输入权限路径"
            v-model="rightsForm.rights_url"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 权限列表
      rights_list: [],
      // 添加权限modal
      dialogVisible: false,

      // 权限表单数据
      rightsForm: {
        rights_name: '',
        rights_url: '',
        r_id: '0'
      },
      rightsRules: {
        rights_name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        rights_url: [
          { required: true, message: '请输入权限路径', trigger: 'blur' }
        ],
        r_id: [{ required: true, message: '请选择上级权限', trigger: 'change' }]
      }
    }
  },
  created () {
    this.getRights()
  },
  methods: {
    // 获取权限列表
    async getRights () {
      const { data: res } = await this.$axios.get('getRights')
      this.rights_list = res.data
    },

    // 关闭添加权限modal
    handleClose () {
      this.$refs.ruleForm.resetFields()
    },

    // 添加权限
    saveRights () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.post(
            'addRights',
            this.rightsForm
          )
          const type = res.status === 201 ? 'success' : 'error'
          this.getRights()
          this.$message({ message: res.msg, type })
          this.$refs.ruleForm.resetFields()
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.rights-header {
  width: 100%;
  height: 100%;
  margin-right: 10px;
  background-color: #fff;
  .el-button {
      margin: 10px;
  }
}
.rights-body {
  margin-top: 10px;
}
</style>
