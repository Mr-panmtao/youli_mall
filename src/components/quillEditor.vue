<template>
  <div>
    <el-upload
      :multiple="multiple"
      :limit="limit"
      class="quill-upload"
      :action="serviceUrl"
      style="display: none;width:0"
      :show-file-list="false"
      :on-success="success"
      :before-upload="beforeAvatarUpload"
    >
      <!-- <el-button size="small" type="primary">点击上传</el-button> -->
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
    <quill-editor
      ref="myQuillEditor"
      v-model="editorData"
      :options="editorOption"
    ></quill-editor>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

// 第三方富文本编辑器组件
// import quillEditor from 'vue-quill-editor'
// // 样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

export default {
  components: { quillEditor },
  props: ['serviceUrl', 'limit', 'multiple', 'editorVal'],
  data () {
    // 富文本配置
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ['image'],
      ['clean'] // remove formatting button
    ]
    return {
      editorOption: {
        placeholder: '请填写商品详情内容 ! ! !',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              // 重写点击组件上的图片按钮要执行的代码
              image: function (value) {
                document.querySelector('.quill-upload .el-icon-upload').click()
              }
            }
          }
        }
      },
      editorData: ''
    }
  },
  created () {
    // 为富文本编辑器赋值 ===》编辑商品
    this.editorData = this.editorVal
  },
  methods: {
    beforeAvatarUpload (file) {
      this.$emit('beforeAvatarUpload', file)
    },
    success (res, file, fileList) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      const vm = this
      const quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.status === '201') {
        // 获取光标所在位置
        const pos = quill.selection.savedRange.index //
        // 插入图片到光标位置
        quill.insertEmbed(pos, 'image', res.fileUrl)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        vm.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    }
  },
  watch: {
    serviceUrl (val) {
      this.serviceUrl = val
    },
    getHeader (val) {
      this.getHeader = val
    },
    editorData (val) {
      this.$emit('getEditorData', this.editorData)
    },
    content (val) {
      this.content = val
    }
  }
}
</script>
