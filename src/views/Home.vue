<template>
    <div class="home">
    <el-container>
  <el-header>
    <div>
      <img src="../assets/heima.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>  
  <el-container>
    <el-aside :width="iscoll?'64px':'200px '">

      <el-menu
      unique-opened
     :collapse=iscoll
      :collapse-transition="false"
      background-color="#373d41"
      text-color="#fff"
      router
      active-text-color="#409EFF" > 
      <div class="toggle-button" @click="toggleColl" >
        |||
      </div>
      <el-submenu :index="item.id+''" v-for="item in list" :key="item.id">
        <template slot="title">
          <i :class="iconObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
         <el-menu-item :index="'/'+childItem.path" v-for="childItem in item.children" :key="childItem.id">{{childItem.authName}}</el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</el-container>
  </div>
</template>
<script>
export default {
  name: 'home',
  components: {
    
  },
  data(){
    return{
    list:[],
    iscoll:false,
    iconObj:{
      '125':'el-icon-user',
      '103':'el-icon-setting',
      '101':'el-icon-goods',
      '102':'el-icon-help',
      '145':'el-icon-search'
    }
  }
  },
  async created() {
    const {data:res}=await this.$http.get('menus'); 
    if(res.meta.status !==200) return this.$message.error(res.meta.msg)
    this.list=res.data; 
  },
  methods: {
    toggleColl(){
       this.iscoll=!this.iscoll;
    },
    logout(){
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
}
</script>


<style scoped lang="less">
.el-aside {
  background-color: #373d41;
  color: #333;
  text-align: center;
  line-height: 200px;
.el-menu { 
  border-right: none;

}
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer; 
}
.home,.el-container{
  height: 100%;
}
.el-header {
    background-color: #373d41;
    color: #fff;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  
  .el-aside {
    background-color: #373d41;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: white;
    color: #333;
    text-align: center;

    
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
