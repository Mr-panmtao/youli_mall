<template>
  <div class="menu-container">
    <div class="menu-header">
      <el-button
        @click="(dialogMenu = true), (flag = true)"
        type="primary"
        size="small"
        icon="el-icon-circle-plus-outline"
        >添加菜单</el-button
      >
    </div>
    <div class="menu-body">
      <el-table :data="menu_list" style="width: 100%" row-key="id">
        <el-table-column prop="menu_name" align="center" label="菜单名称">
        </el-table-column>
        <el-table-column align="center" label="菜单图标(elm)">
          <template slot-scope="scope">
            <i style="fontSize:20px" :class="scope.row.menu_icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="menu_url" align="center" label="路径">
        </el-table-column>
        <el-table-column prop="sort" align="center" label="排序">
        </el-table-column>
        <el-table-column prop="is_enabled" align="center" label="是否启用">
          <template slot-scope="scope">
            <el-tag
              size="medium"
              v-if="scope.row.is_enabled === 1"
              color="#19BE6B"
              effect="dark"
              type="success"
              >已启用</el-tag
            >
            <el-tag
              size="medium"
              v-if="scope.row.is_enabled !== 1"
              color="#F56C6C"
              effect="dark"
              type="danger"
              >已禁用</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editMenu(scope.row)"
              >编辑</el-button
            >

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delMenu(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加 / 编辑菜单 -->
    <el-dialog
      :title="flag ? '添加菜单' : '编辑菜单'"
      :visible.sync="dialogMenu"
      @close="closeDialog"
      width="40%"
    >
      <div style="padding:0 249px 0 40px">
        <el-form
          :model="menuForm"
          :rules="menuRules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="上级菜单" prop="pid">
            <el-select
              style="width:100%"
              v-model="menuForm.pid"
              placeholder="请选择上级菜单"
            >
              <el-option label="顶级菜单" value="0"></el-option>
              <el-option
                v-for="item in menu_list"
                :key="item.id"
                :label="item.menu_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称" prop="menu_name">
            <el-input
              placeholder="请输入菜单名称"
              v-model="menuForm.menu_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="菜单地址" prop="menu_url">
            <el-input
              placeholder="请输入菜单地址"
              v-model="menuForm.menu_url"
            ></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" prop="menu_icon">
            <el-input
              placeholder="请输入菜单图标"
              v-model="menuForm.menu_icon"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="menuForm.sort"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch
              :inactive-value="0"
              :active-value="1"
              inactive-text="禁用"
              active-text="启用"
              v-model="menuForm.is_enabled"
            ></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="operation-menu">
          <el-button @click="dialogMenu = false">取 消</el-button>
          <el-button type="primary" @click="operationMenu">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 菜单数据
      menu_list: [],
      // 添加 编辑菜单dialog
      dialogMenu: false,
      // 当前为添加菜单 / 编辑菜单
      flag: true,
      //   添加菜单数据对象
      menuForm: {
        pid: '0',
        menu_name: '',
        menu_url: '',
        menu_icon: '',
        sort: 0,
        is_enabled: 1
      },
      menuRules: {
        menu_name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        menu_url: [
          { required: true, message: '请输入菜单地址', trigger: 'blur' }
        ],
        menu_icon: [
          { required: true, message: '请输入菜单图标', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
      },
      id: 0
    }
  },
  created () {
    this.getMenu()
  },
  methods: {
    // 获取菜单栏数据
    async getMenu () {
      const { data: res } = await this.$axios.get('getMenu')
      this.menu_list = res.data
    },
    closeDialog () {
      this.$refs.ruleForm.resetFields()
      this.menuForm.menu_name = ''
      this.menuForm.menu_url = ''
      this.menuForm.menu_icon = ''
      this.menuForm.pid = '0'
      this.menuForm.is_enabled = 1
      this.menuForm.sort = 0
    },
    // 添加 、修改菜单
    operationMenu () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 添加
          if (this.flag) {
            this.addMenu()
          } else {
            this.modifyMenu()
          }
          this.getMenu()
          this.$refs.ruleForm.resetFields()
          this.dialogMenu = false
        }
      })
    },
    // 添加
    async addMenu () {
      const { data: res } = await this.$axios.post('addMenu', this.menuForm)
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
    },
    // 编辑 modal显示
    editMenu (menuInfo) {
      const info = JSON.parse(JSON.stringify(menuInfo))
      delete info.children
      this.id = info.id
      delete info.id
      if (info.pid === 0) {
        info.pid = info.pid.toString()
      }
      this.flag = false
      this.dialogMenu = true
      this.menuForm = info
    },
    // 编辑api
    async modifyMenu () {
      const { data: res } = await this.$axios.post(
        `modifyMenu?id=${this.id}`,
        this.menuForm
      )
      const type = res.status === 201 ? 'success' : 'error'
      this.$message({ message: res.msg, type })
    },
    // 删除菜单
    delMenu (menuInfo) {
      this.$confirm(
        `你确定要删除 【${menuInfo.menu_name} 】 该菜单项吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        if (menuInfo.children.length >= 1) {
          return this.$message({
            message: `【${menuInfo.menu_name}】包含子菜单，无法删除`,
            type: 'error'
          })
        }
        const { data: res } = await this.$axios.get(`delMenu?id=${menuInfo.id}`)
        const type = res.status === 201 ? 'success' : 'error'
        this.$message({ message: res.msg, type })
        this.getMenu()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-container {
  width: 100%;
  height: 100%;

  .menu-header {
    padding: 10px;
    background-color: #fff;
  }
  .menu-body {
    margin-top: 10px;
  }
  .operation-menu {
    display: flex;
    justify-content: left;
    padding-left: 140px;
  }
}
</style>
