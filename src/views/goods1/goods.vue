<template>
  <div class=''>
                <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页
  </el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表 </el-breadcrumb-item>
</el-breadcrumb>
<el-card>
  <el-row :gutter="20">
   <el-col :span="8">
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
      <el-button slot="append" icon="el-icon-search" @click="getGoodsList">  
      </el-button>
  </el-input>
  </el-col>
   <el-col :span="4">
      <el-button type="primary" @click="add">添加用户</el-button>
  </el-col>
  </el-row>
</el-card>
<el-table :data="Goodslist" border stripe style="width:100%">
   <el-table-column type="index"></el-table-column>
   <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
      <el-table-column  prop="goods_price" label="商品价格" ></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
       <el-table-column prop="add_time" label="创建时间">
         <template slot-scope="scope">
           {{scope.row.add_time |dataFormat}}
         </template>
       </el-table-column>
        <el-table-column label="操作">
           <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-edit"  @click="handleEdit(scope.row.goods_id)"></el-button>
        <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row.goods_id)"></el-button>
           </template>
        </el-table-column>
</el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum" 
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
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
      total:0,
      dialogVisible:false,
      Goodslist:[],
      queryInfo:{
            query:'',
            pagenum:1,
            pagesize:2,
        },
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleEdit(id){
      this.$router.push('/goods1/update/'+id);
     
    },
    // handleEdit(id){
    //   this.$router.push('/goods1/update/'+id);
    // },
   async handleDelete(id){
 const { data: res }=await this.$http.delete("goods/"+id)
//  if(res.meta.status !==200){
//                  return this.$message.error("删除失败！")
//             }
            this.$message.success("删除成功！");
            this.getGoodsList();
    },
    handleCurrentChange(newPage){
          this.queryInfo.pagenum=newPage;
          this.getGoodsList();
      },
      handleSizeChange(newSize){
          this.queryInfo.pagesize=newSize;
          this.getGoodsList();
      },
    add(){
      this.$router.push("/goods/add");
    },
async getGoodsList(){
    const { data: res}=await this.$http.get("goods",{
      params:this.queryInfo
  })
  console.log(res);
  
  this.Goodslist=res.data.goods;
  this.total=res.data.total;
},
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getGoodsList();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },

}
</script>

