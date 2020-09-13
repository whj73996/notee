<template>
  <span :title="username">{{slug}}</span>
</template>

<script>
  import auth from '../apis/auth'
  import Bus from  '../helpers/bus'
  import bus from '../helpers/bus'
  export default {
    data() {
      return {
        username: 'hunger'
      }
    },
    computed: {
      slug() {
        return this.username.charAt(0)
      }
    },
    created() {
      bus.$on('userInfo',(data)=>{this.username=data.username})
      auth.getInfo().then(res=>{
        if(res.data){
          this.username = res.data.username
        }
      })
    }
  }
</script>

<style scoped>

  span {
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 32px;
    border-radius: 50%;
    background: #f2b81c;
    color: #fff;
    text-shadow: 1px 0 1px #795c19;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 18px;
    margin-top: 15px;
  }
</style>