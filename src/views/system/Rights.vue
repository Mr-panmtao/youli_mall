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
      <el-table  height="750" :data="rights_list" style="width: 100%" row-key="id">
        <el-table-column prop="rights_name" align="center" label="权限名称">
        </el-table-column>
        <el-table-column prop="rights_url" align="center" label="路径">
        </el-table-column>
        <el-table-column align="center" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.rights_grade === 1">一 级</el-tag>
            <el-tag type="success" v-if="scope.row.rights_grade === 2"
              >二 级</el-tag
            >
            <el-tag type="warning" v-if="scope.row.rights_grade === 3"
              >三 级</el-tag
            >
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
        <el-form-item label="上级权限" prop="r_id">
          <el-cascader
            style="width:100%"
            placeholder="顶级权限"
            v-model="rightsForm.r_id"
            :options="rights_list"
            :props="options"
          ></el-cascader>
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
import { getTreeData } from '@/views/utils/Tree'
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
        r_id: ['0'],
        rights_grade: 1
      },
      rightsRules: {
        rights_name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        rights_url: [
          { required: true, message: '请输入权限路径', trigger: 'blur' }
        ]
      },
      options: {
        expandTrigger: 'hover',
        label: 'rights_name',
        value: 'id',
        checkStrictly: true
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
      this.rights_list = getTreeData(res.data)
    },

    // 关闭添加权限modal
    handleClose () {
      this.$refs.ruleForm.resetFields()
    },

    // 添加权限
    saveRights () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.rightsForm.r_id[0] !== '0') {
            this.rightsForm.rights_grade = this.rightsForm.r_id.length + 1
          } else {
            this.rightsForm.rights_grade = this.rightsForm.r_id.length
          }
          this.rightsForm.r_id = this.rightsForm.r_id[
            this.rightsForm.r_id.length - 1
          ]
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
