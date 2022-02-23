<template>
  <div class=''>
            <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页
  </el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类 </el-breadcrumb-item>
</el-breadcrumb>
<el-card> 
   <el-row  :gutter="20">
       <el-col :span="2">
             <el-button type="primary" @click="showAdd">添加商品</el-button>
       </el-col>
       
   </el-row>
    <zk-table
    style="margin-top:10px"
      ref="table"
    :selection-type="false"
    :expand-type="false"
      index-text="#"
      :data="data"
      :columns="columns"
>
      <template slot="likes" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color:lightgreen"></i>
        <i class="el-icon-error" v-else style="color:red"></i>
      </template>
      <template slot="level" slot-scope="scope">
       <el-tag size="mini" v-if="scope.row.cat_level===0"> 一级</el-tag>
       <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1"> 二级</el-tag>
       <el-tag type="warning" size="mini" v-else> 三级</el-tag>
      </template>
       <template slot="opt" slot-scope="scope">
        <el-button size="mini" icon="el-icon-edit"  @click="showAdd(scope.row.cat_id)">编辑</el-button>
        <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row.cat_id)">删除</el-button>
      </template>
    </zk-table>
</el-card>
<el-dialog title="添加分类" :visible.sync="AddDialogVisible" width="30%" :before-close="handleClose">
   <el-form :model="addForm" :rules="rules" ref="ruleForm" label-width="100px">
       <el-form-item label="分类名称:" prop="cat_name">
    <el-input v-model="addForm.cat_name"></el-input>
  </el-form-item>
     <el-form-item label="父级分类:">
        <el-cascader
    v-model="value"
    style="width:100%"
    :options="options"
    :props="cateProps"
    @change="handleChange" 
> 
    </el-cascader>
     </el-form-item>

   </el-form>
     <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
  </span>
</el-dialog>
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
      id:'',
      data:[],
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        checkStrictly:true
      },
      value: [],
        options: [],
       AddDialogVisible:false, 
      rules:{
          cat_name: [
            { required: true, message: '请输入分名称', trigger: 'blur' },
            { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
          ]
      },
      addForm:{
        cat_name:'',
        cat_level:'',
        cat_pid:''
      },
     
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
        columns: [
        
          {
            label: '分类名称',
            prop: 'cat_name',
            width: '400px',
          },
          {
            label: '是否有效',
            prop: 'cat_deleted',
             type: 'template',
            template: 'likes',
            minWidth: '50px', 
          },
          {
            label: '排序',
            prop: 'cat_level',
            type: 'template',
             template: 'level',
          },
           {
            label: '操作',
             minWidth: '200px', 
            type: 'template',
             template: 'opt',
          },
          
        ],
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleClose(){
      this.AddDialogVisible=false;
      this.$refs.ruleForm.resetFields()
      this.value=[]
      this.addForm.cat_level=0;
      this.addForm.cat_pid=0
    },
    add(){
      this.$refs.ruleForm.validate(async valid=>{
      if(!valid) return;
      if(this.id){
        const {data:res}=await this.$http.put("categories/"+this.id,this.addForm)
        this.$message.success("修改成功");
        this.id="";
      }else{
        const {data:res}=await this.$http.post("categories",this.addForm);
        this.$message.success("添加成功");
      
      }
        this.AddDialogVisible=false;
        this.getCateList();
      //   const {data:res}=await this.$http.put('categories/'+this.id,this.addForm)
        
      //  this.$message.success("修改成功")
      //  this.getCateList();
      //  this.AddDialogVisible=false;
      //  this.id="";
      // }else{
      // const {data:res}=await this.$http.post("categories",this.addForm)
      // if(res.meta.status!=201){
      //     return this.$message.error("添加失败")
      // }
      //  this.$message.success("添加成功")
      //  this.getCateList();
      //  this.AddDialogVisible=false;
      // }
      })
      
     
    },
    handleChange(){
      if(this.value.length==0){
        this.addForm.cat_pid=0;
        this.addForm.cat_level=0;
      }else if(this.value.length==1){
          this.addForm.cat_pid=this.value[0];
          this.addForm.cat_level=1;
      }else{
         this.addForm.cat_pid=this.value[1];
          this.addForm.cat_level=2;
      }
      // if(this.value.length===1){//添加二级分类
      //   this.addForm.cat_pid=this.value[0];
      //   this.addForm.cat_level=1;
      // }else if(this.value.length===2){//添加三级分类
      //     this.addForm.cat_pid=this.value[1];
      //   this.addForm.cat_level=2;
      // }else{
      //   this.addForm.cat_pid=0;//什么也不选添加一级分类
      //   this.addForm.cat_level=0;
      // }
    },
   async getCateList1(){//获取分类数据
   const {data:res}=await this.$http.get("categories",{
      params:{type:2}
    })
    this.options=res.data
     console.log(res);
    },
    async showAdd(id){
      this.AddDialogVisible=true;
      this.getCateList1();
      if(id){
        const {data:res}=await this.$http.get("categories/"+id)
        console.log(res);
        this.value=[];
        this.id=res.data.cat_id;
          this.addForm.cat_name=res.data.cat_name;
           this.addForm.cat_pid=res.data.cat_pid;
       if(res.data.cat_level==1){
        this.value=[res.data.cat_pid]
       }else if(res.data.cat_level==2){
         const {data:res1}=await this.$http.get("categories/"+res.data.cat_pid)
         this.value=[res1.data.cat_pid,res.data.cat_pid]
       }


      }
    },
// async showAdd(id){
// this.AddDialogVisible=true;
// this.getCateList1();
// if(id){
//   const {data:res}=await this.$http.get("categories/"+id)
//   this.value=[];
//   this.id=res.data.cat_id;
//   this.addForm.cat_name=res.data.cat_name;
//   this.addForm.cat_pid=res.data.cat_pid;
//   if(res.data.cat_level==1){
//   this.value=[res.data.cat_pid]
//   }else if(res.data.cat_level==2){
//       const {data:res1}=await this.$http.get("categories/"+res.data.cat_pid)
//     this.value=[res1.data.cat_pid,res.data.cat_pid]//显示两个值
//   }
// }
// },
 async getCateList(){//查看列表

  const {data:res}=await this.$http.get("categories",{
    params:this.queryInfo
  })
  this.data=res.data.result;

},

 async handleDelete(id){
     const delete1=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)
           if(delete1!='confirm'){
          return this.$message.info("取消了删除!")
        }
const {data:res}=await this.$http.delete("categories/"+id)
 if(res.meta.status!=200){
              return this.$message.error("删除失败！")
        }
         this.$message.success("删除成功！");
         this.getCateList();
}
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
this.getCateList();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  beforeCreate () {}, // 生命周期 - 创建之前
  beforeMount () {}, // 生命周期 - 挂载之前
  beforeUpdate () {}, // 生命周期 - 更新之前
  updated () {}, // 生命周期 - 更新之后
  beforeDestroy () {}, // 生命周期 - 销毁之前
  destroyed () {}, // 生命周期 - 销毁完成
  activated () {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

