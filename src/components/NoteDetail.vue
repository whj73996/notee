<template>
  <div id="note" class="detail">
    <note-sidebar :curNote="curNote" @update:notes="val=> notes = val"></note-sidebar>

    <div class="note-detail">
      <div class="note-empty" v-if="!curNote.id">请选择笔记</div>
      <div v-else class="note-detail-ct">
        <div class="note-bar">
          <span>创建日期：{{curNote.createdAtFriendly}}</span>
          <span>更新日期：{{curNote.updatedAtFriendly}}</span>
          <span class="status" :class="{'status-input':isInput,'status-wrong':isWrong}">{{statusText}}</span>
          <span class="iconfont icon-delete" @click="deleteNote"></span>
          <span class="iconfont icon-fullscreen" @click="isShowPreview=!isShowPreview"></span>
        </div>
        <div class="note-title">
          <input type="text" v-model="curNote.title" @input="updateNote" @keydown="status" placeholder="输入标题"></input>
        </div>
        <div class="editor">
          <textarea v-show="!isShowPreview" v-model="curNote.content" @input="updateNote" @keydown="status" placeholder="输入内容，支持 markdown 语法"></textarea>
          <div class="preview markdown-body" v-html="previewContent" v-show="isShowPreview">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NoteSidebar from './NoteSidebar'
  import Auth from '../apis/auth'
  import Bus from  '../helpers/bus'
  import _ from 'lodash'
  import Notes from '../apis/notes'
  import  MarkdownIt from 'markdown-it'
  let md = new MarkdownIt();

  export default {
    name: 'NoteDetail',
    components: {NoteSidebar},
    data () {
      return {
        curNote:{
        },
        notes:[],
        statusText:'笔记未更改',
        isInput:false,
        isWrong:false,
        isShowPreview:false
      }
    },
    computed:{
      previewContent(){
        return md.render(this.curNote.content)
      }
    },
    methods:{
      updateNote:_.debounce(function () {
        Notes.updateNote({noteId:this.curNote.id},{title:this.curNote.title,content:this.curNote.content})
        .then(data=>{
          this.isWrong=false
          this.isInput=false
          this.statusText='笔记已保存'
        }).catch(res=>{
          this.statusText='保存出错'
          this.isWrong=true
        })
      },300),
      deleteNote(){
        Notes.deleteNote({noteId:this.curNote.id})
        .then(data=>{
          this.$message.success(data.msg)
          console.log(this.notes.indexOf(this.curNote))
          this.notes.splice(this.notes.indexOf(this.curNote),1)
          this.$router.replace('/note')
        })
        .catch(data=>{
          this.$message.error(data.msg)
        })
      },
      status(){
        this.isWrong=false
        this.isInput=true
        this.statusText='正在输入...'
      }
    },

    created() {
      Auth.getInfo()
        .then(res => {
          if (!res.isLogin) {
            this.$router.push({path: '/login'})
          }
        })
        Bus.$on('update:notes', (val)=>{
          this.curNote=val.find(note => note.id.toString()===this.$route.query.noteId)||{}})
    },
    beforeRouteUpdate(to,from,next){
      this.curNote = this.notes.find(note => note.id.toString()===to.query.noteId)||{}
      next()
    },

  }
</script>

<style lang="less" scoped>
  @import url(../assets/css/note-detail.less);


  #note {
    display: flex;
    align-items: stretch;
    background-color: #fff;
    flex: 1;
  }

</style>