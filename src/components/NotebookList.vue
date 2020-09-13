<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="onCreate"><i class="iconfont icon-plus"></i> 新建笔记本</a>
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表({{notebooks.length}})</h3>
        <div class="book-list">
          <router-link v-for="notebook in notebooks" :to="`/note?notebookId=${notebook.id}`" class="notebook">
            <div>
              <span class="iconfont icon-notebook"></span> {{notebook.title}}
              <span>{{notebook.noteCounts}}</span>
              <span class="action" @click.stop.prevent="onEdit(notebook)">编辑</span>
              <span class="action" @click.stop.prevent="onDelete(notebook)">删除</span>
              <span class="date">{{notebook.friendlyCreatedAt}}</span>
            </div>
          </router-link>
        </div>
      </div>

    </main>

  </div>
</template>
<script>
  import Auth from '../apis/auth'
  import Notebooks from '../apis/notebooks'
  import {friendlyDate} from '../helpers/util'
  import notebooks from '../apis/notebooks'

  //window.Notebooks = Notebooks

  export default {
    data() {
      return {
        notebooks: []
      }
    },

    created() {
      Auth.getInfo()
        .then(res => {
          if (!res.isLogin) {
            this.$router.push({path: '/login'})
          }
        })

      Notebooks.getAll()
        .then(res => {
          this.notebooks = res.data
        })
    },

    methods: {
      onCreate() {
        this.$prompt('请输入笔记本标题', '创建笔记本', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,30}$/,
          inputErrorMessage: '标题不能为空，且不超过30个字符'
        }).then(({value}) => {
          return notebooks.addNotebook({title: value})
        })
          .then(res => {
            res.data.friendlyCreatedAt = friendlyDate(res.data.createdAt)
            this.notebooks.unshift(res.data)
            this.$message.success(res.msg);
          }).catch(()=>{})
      },

      onEdit(notebook) {
        let modifiedTitle = ''
        this.$prompt('请输入新的笔记本标题', '修改笔记本', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:notebook.title,
          inputPattern: /^.{1,30}$/,
          inputErrorMessage: '标题不能为空，且不超过30个字符'
        }).then(({value}) => {
          modifiedTitle = value
          return notebooks.updateNotebook(notebook.id, {title: value})
        }).then(res => {
            notebook.title = modifiedTitle
            this.$message.success(res.msg);
          }).catch(()=>{})
      },

      onDelete(notebook) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return  Notebooks.deleteNotebook(notebook.id)
        }).then(res => {
            this.notebooks.splice(this.notebooks.indexOf(notebook), 1)
            this.$message.success(res.msg);
          }).catch(()=>{})
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../assets/css/notebook";
</style>