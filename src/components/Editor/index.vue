<template>
  <div>
    <textarea id="editor" name="editor" rows="10" cols="80" style="display: none"></textarea>
    <div id="editorMultiUploadContainer" style="display: none">
      <a id="editorMultiUploadPick" href="javascript:void(0)">[点击选择文件]</a>
    </div>
  </div>
</template>

<script>
import { baseConfig, customConfig } from './editorConfig'
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      // 1 基础编辑器 2 自定义编辑器
      type: Number,
      default: 1
    },
    receiveConfig: {
      // 传入自定义config
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      editor: null
    }
  },
  computed: {},
  watch: {
    value(newValue, oldValue) {
      if (this.editor && newValue !== this.editor.getData()) {
        this.editor.setData(newValue)
      }
    }
  },
  mounted() {
    this.initEditor()
  },
  beforeDestroy() {
    // 销毁 editor 实例
    this.editor.destroy()
  },
  methods: {
    initEditor() {
      this.editor = window.CKEDITOR.replace(
        'editor',
        this.type === 1 ? Object.assign(baseConfig, this.receiveConfig) : Object.assign(customConfig, this.receiveConfig)
      )
      // 添加钩子 cb 在实例化完成后设置编辑器内容
      this.editor.on('instanceReady', () => {
        // 如果初始化编辑器时,value为空,那么就什么都不做,避免修改到content
        this.value ? this.editor.setData(this.value) : null
      })
      this.editor.on('focus', () => {
        this.$emit('focus')
      })
      this.editor.on('blur', () => {
        this.$emit('blur')
      })
      // 在编辑器内容变化时,向父级传递
      this.editor.on('change', () => {
        // console.log(this.editor.getData())
        this.$emit('input', this.editor.getData())
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .cke_contents{
  min-height: 300px;
}
</style>
