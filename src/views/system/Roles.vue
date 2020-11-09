<template>
  <div class="roles_container">
    <div class="roles-header">
      <el-button
        @click="(dialogVisible = true), (flag = true)"
        type="primary"
        size="small"
        icon="el-icon-circle-plus-outline"
        >添加角色</el-button
      >
    </div>
    <div class="roles-body">
      <el-table
        :data="roles_list"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          align="center"
          label="#"
          width="100px"
        ></el-table-column>
        <el-table-column prop="role_name" align="center" label="角色名称">
        </el-table-column>
        <el-table-column prop="role_describe" align="center" label="角色描述">
        </el-table-column>
        <el-table-column align="center" width="380" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRoles(scope.row)"
              >编辑</el-button
            >

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delRoles(scope.row)"
              >删除</el-button
            >

            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="isRightsShow(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加 / 编辑角色modal -->
    <el-dialog
      :title="flag === true ? '添加角色' : '编辑角色'"
      @close="handleClose"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form
        :model="rolesForm"
        :rules="rolesRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item required label="角色名称" prop="role_name">
          <el-input
            placeholder="请输入角色名称"
            v-model="rolesForm.role_name"
          ></el-input>
        </el-form-item>
        <el-form-item required label="角色描述" prop="role_describe">
          <el-input
            placeholder="请输入角色描述"
            v-model="rolesForm.role_describe"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限modal -->
    <el-dialog
      title="分配权限"
      @close="rightsClose"
      :visible.sync="dialogRights"
      width="30%"
    >
      <!-- 树桩控件 -->
      <el-tree
        :data="treeList"
        show-checkbox
        node-key="id"
        default-expand-all
        ref="rightsKeys"
        :props="defaultProps"
        :default-checked-keys="checkedRights"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRights = false">取 消</el-button>
        <el-button type="primary" @click="addRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getTreeData } from '@/views/utils/Tree'
export default {
  data () {
    return {
      roles_list: [],

      //   树状控件====权限信息
      treeList: [],
      // 树桩控件数据
      defaultProps: {
        children: 'children',
        label: 'rights_name'
      },
      // 添加 / 编辑 角色modal
      dialogVisible: false,
      // 分配权限modal
      dialogRights: false,
      // 默认选中的权限
      checkedRights: [],

      // 权限表单数据
      rolesForm: {
        role_name: '',
        role_describe: ''
      },
      rolesRules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        role_describe: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 当前角色信息对象
      rolesInfo: {},
      // 区分当前为添加角色 / 编辑角色
      flag: true
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    // 获取角色信息列表
    async getRoles () {
      const { data: res } = await this.$axios.get('getRoles')
      this.roles_list = res.data
      // console.log(this.roles_list)
    },
    // 关闭添加角色modal
    handleClose () {
      this.$refs.ruleForm.resetFields()
      this.rolesForm.role_describe = ''
      this.rolesForm.role_name = ''
    },

    // 添加角色
    saveRoles () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.flag) {
            this.addRoles()
          } else {
            this.editroles()
          }
        }
      })
    },

    // 添加角色 ===>request
    async addRoles () {
      const { data: res } = await this.$axios.post('addRoles', this.rolesForm)
      const type = res.status === 201 ? 'success' : 'error'
      this.getRoles()
      this.$message({ message: res.msg, type })
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
    },
    // 编辑角色 ===> request
    async editroles () {
      const { data: res } = await this.$axios.post(
        `editRoles?id=${this.rolesInfo.id}`,
        this.rolesForm
      )
      const type = res.status === 201 ? 'success' : 'error'
      this.getRoles()
      this.$message({ message: res.msg, type })
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
    },

    // 编辑角色
    editRoles (item) {
      this.rolesForm.role_describe = item.role_describe
      this.rolesForm.role_name = item.role_name
      this.dialogVisible = true
      this.flag = false
      this.rolesInfo = item
    },
    // 分配权限modal显示
    isRightsShow (item) {
      this.rolesInfo = item

      // 克隆 ===> 更改原数据第二次点击会报错
      const values = JSON.parse(JSON.stringify(item))
      const i = getTreeData(values.children)
      values.children = i
      // 设置Tree默认选中
      this.fillerRights(values, this.checkedRights)

      this.getRights()
      this.dialogRights = true
    },
    // 递归函数 筛选已有权限默认打钩
    fillerRights (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.fillerRights(item, arr)
      })
    },
    // 获取权限列表
    async getRights () {
      const { data: res } = await this.$axios.get('getRights')
      this.treeList = res.data
    },
    // 分配权限
    async addRights () {
      const keys = [
        ...this.$refs.rightsKeys.getHalfCheckedKeys(),
        ...this.$refs.rightsKeys.getCheckedKeys()
      ]
      const rids = keys.join(',')
      const { data: res } = await this.$axios.post('setupRights', {
        rids,
        id: this.rolesInfo.id
      })
      const type = res.status === 201 ? 'success' : 'error'
      this.getRoles()
      this.$message({ message: res.msg, type })
    },

    // 分配权限modal关闭
    rightsClose () {
      this.checkedRights = []
    },

    // 删除角色
    delRoles (item) {
      this.$confirm('是否要删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.get(`delRoles?id=${item.id}`)
        const type = res.status === 201 ? 'success' : 'error'
        this.$message({ message: res.msg, type })
        this.getRoles()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.roles_container {
  width: 100%;
  height: 100%;

  .roles-header {
    padding: 10px;
    background-color: #fff;
  }

  .roles-body {
    margin-top: 10px;
  }
}
</style>
