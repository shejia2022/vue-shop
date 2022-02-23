<template>
  <div class=''>
          <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页
  </el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表 </el-breadcrumb-item>
</el-breadcrumb>
    <el-table :data="rightsList" border stripe style="width:100%">
    <el-table-column type="index"></el-table-column>
    
      <el-table-column  prop="authName" label="权限说明" ></el-table-column>
      <el-table-column prop="level" label="权限层级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级分类</el-tag>
                   <el-tag v-if="scope.row.level==1" type="success">二级分类</el-tag>
                     <el-tag v-if="scope.row.level==2" type="info">三级分类</el-tag>
                      </template>
      </el-table-column>
       <el-table-column prop="pid" label="权限父 ID"></el-table-column>
         <el-table-column prop="path" label="对应访问路径"></el-table-column>
    </el-table>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
  // 这里存放数据
    return {
rightsList:[]
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
   async getrightsList(){
       const {data:res}=await this.$http.get("rights/list")
       if(res.meta.status!==200){
                 return this.$message.error("获取权限列表失败！")
          }
          this.rightsList=res.data;
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getrightsList();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },

}
</script>

