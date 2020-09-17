<template>
  <div class="note-sidebar">
    <span class="btn add-note" @click="addNote" >添加笔记</span>
    <el-dropdown class="notebook-title"  @command="handleCommand" placement="bottom">
      <span class="el-dropdown-link">
        {{curBook.title}} <i class="iconfont icon-down"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="notebook in notebooks" :command="notebook.id">{{notebook.title}}</el-dropdown-item>
        <el-dropdown-item  command="trash">回收站</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="menu">
      <div>更新时间</div>
      <div>标题</div>
    </div>
    <ul class="notes">
      <li v-for="note in notes">
        <router-link :to="`/note?noteId=${note.id}&notebookId=${curBook.id}`">
          <span class="date">{{note.updatedAtFriendly}}</span>
          <span class="title">{{note.title}}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import Notes from '../apis/notes'
  import {mapMutations,mapState,mapActions,mapGetters}from 'vuex'
  export default {
    created() {
      this.getNotebooks()
        .then(()=>{
          this.$store.commit('setCurBook',{curBookId:this.$route.query.notebookId})
          this.$store.dispatch('getNotes',{noteBookId:this.curBook.id})
        })

      // Notebooks.getAll()
      //   .then(res => {
      //     this.notebooks = res.data
      //     this.curBook =(this.$route.query.notebookId && this.notebooks.find(notebook => notebook.id.toString() === this.$route.query.notebookId))
      //       || this.notebooks[0] || {}
      //     return Notes.getAll({ notebookId: this.curBook.id })
      //   }).then(res => {
      //   this.notes = res.data
      //   this.$emit('update:notes', this.notes)
      //   Bus.$emit('update:notes', this.notes)
      // })
    },

    data() {
      return {
      }
    },
    computed:{
      ...mapGetters([
        'notebooks',
        'notes',
        'curBook'
      ])
    },

    methods: {
      ...mapActions([
        'getNotebooks',
        'getNotes'
      ]),

      handleCommand(notebookId) {
        if(notebookId === 'trash') {
          return this.$router.push({ path: '/trash'})
        }
        console.log('----------')

        console.log(notebookId)
        this.$store.commit('setCurBook',{curBookId:notebookId})
        this.$store.dispatch('getNotes',{noteBookId:notebookId})
      },

      addNote() {
        Notes.addNote({ notebookId: this.curBook.id })
          .then(res => {
            this.notes.unshift(res.data)
          })
      }

    }
  }
</script>

<style lang="less" scoped>
@import '../assets/css/note-sidebar';
</style>