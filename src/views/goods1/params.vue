<template>
  <div class=''>
    <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页
  </el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>分类参数 </el-breadcrumb-item>
</el-breadcrumb>
<el-card>
     <el-alert
    title="警告提示的文案"
    type="warning"
    show-icon>
  </el-alert>
   <el-row :gutter="20" style="margin-top:10px;">
        
       <el-col :span="8">
<span style="margin-left:-30px">选择分类商品：</span>
  <el-cascader
    v-model="value1"
    style="text-align:center"
    :options="cateList"
    :props="cateProps"
    @change="handleChange" 
> 
    </el-cascader>  
       </el-col>
   </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
     <el-col :span="1">
            <el-button type="primary" size="mini" :disabled="isbtnDisabled" @click="addDialog" >添加</el-button>
     </el-col>
     <el-table :data="manytableData" border stript>
         <el-table-column type="expand">
             <template slot-scope="scope">
                <el-tag
  :key="index"
  v-for="(tag,index) in scope.row.attr_vals"
  closable
  :disable-transitions="false"
  @close="handleClose(scope.row,index)">
  {{tag}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
             </template>
         </el-table-column>
      <el-table-column type="index"></el-table-column>
        <el-table-column  prop="attr_name" label="参数名称" ></el-table-column>
         <el-table-column label="操作">
                <template slot-scope="scope">
        <el-button size="mini" icon="el-icon-edit"  @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row.attr_id)">删除</el-button>
                </template> 
         </el-table-column>
     </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态参数" name="only">
         <el-col :span="1">
            <el-button type="primary" size="mini" :disabled="isbtnDisabled" @click="addDialog" >添加</el-button>
     </el-col>
     <el-table :data="onlytableData" border stript>
           <el-table-column type="expand">
             <!-- <template slot-scope="scope">

             </template> -->
         </el-table-column>
     <el-table-column type="index"></el-table-column>
      <el-table-column  prop="attr_name" label="参数名称" ></el-table-column>
         <el-table-column label="操作">
                <template slot-scope="scope">
        <el-button size="mini" icon="el-icon-edit"  @click="handleEdit(scope)">编辑</el-button>
        <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row.attr_id)">删除</el-button>
                </template>
         </el-table-column>
     </el-table>
    </el-tab-pane>

  </el-tabs>
</el-card>
    <el-dialog :title="'添加分类'+titleText" :visible.sync="AddDialogVisible" width="30%" :before-close="handleClose1">
    <el-form :model="addForm" :rules="rules" ref="ruleForm" label-width="100px">
       <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
   </el-form>  
   <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose1">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
   <el-dialog :title="'修改'+ titleText" :visible.sync="editDialogVisible"  width="50%"  @close="editDialogClosed">
             <el-form :model="editForm" label-width="70px">
                  <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                    
             </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="upDateParams">确 定</el-button>
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
    // 监听属性 类似于data概念
  computed:{

      cateId(){
          if(this.value1.length===3){  
              return this.value1[2]
          }
          return null
      },
      isbtnDisabled(){
          if(this.value1.length!==3){
              return true
          }
          return false
      },
      titleText(){
          if(this.activeName==="many"){
              return '动态参数'
          }
                return '动态参数'
      }
  },
  data () {
  // 这里存放数据
    return {
        editDialogVisible:false,
        addForm:{
            attr_name:'',
        },
         editForm:{
        attr_id:"",
        attr_name:'',
        attr_vals:''
   },
         rules:{
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
          ]
      },
        onlytableData:[],
        manytableData:[],
        AddDialogVisible:false,
        activeName:'many',
        value1:[],
        cateList:[],
        cateProps:{
                value:'cat_id',
                 label:'cat_name',
        }
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合  
  methods: {
            handleClose1(){
this.$refs.ruleForm.resetFields();
this.AddDialogVisible=false;
      },
     async addParams(){//添加确定
 this.$refs.ruleForm.validate(async valid=>{
      if(!valid) return;
 const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{
                   attr_name:this.addForm.attr_name,
                   attr_sel:this.activeName
               })
                if(res.meta.status!==201){
             return this.$message.error("添加参数项失败")
        }
        this.$message.success("添加参数成功")
        this.AddDialogVisible=false;
        this.getParamsData(); 
 })
      },
      handleClose(row,index){
          row.attr_vals.splice(index,1)
          this.saveAttrVals(row)
      },
     async handleDelete(id){//删除
            const delete1=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)
           if(delete1!='confirm'){
          return this.$message.info("取消了删除!")
        }
        const {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        if(res.meta.status!=200){
              return this.$message.error("删除失败！")
        }
         this.$message.success("删除成功！");
         this.getParamsData();
      },
    async  upDateParams(){//修改
          const{data:res}=await this.$http.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
                attr_name:this.editForm.attr_name,
                attr_sel : this.activeName,
                attr_vals : this.editForm.attr_vals
            }
            )
            if(res.meta.status !==200){
                 return this.$message.error('修改参数失败!')
            }
            this.$message.success('修改参数成功')
            this.editDialogVisible=false
            this.getParamsData();
      },
      editDialogClosed(){//修改关闭
this.editDialogVisible=false;
      },
     async handleEdit(row){//修改显示对话框
     this.editDialogVisible=true;
           const{data:res}=await this.$http.get(
            `categories/${this.cateId}/attributes/${row.attr_id}`,
            {
                params:{attr_sel:this.activeName}
            }
            )
            //修改的时候，需要把attr_id，attr_name，attr_vals带到后台接口

            this.editForm.attr_id=row.attr_id;
            this.editForm.attr_name=row.attr_name;
            this.editForm.attr_vals=res.data.attr_vals;
      },
     async addDialog(){//显示添加输入框
        this.AddDialogVisible=true;
              
      },
      handleClick(){
        this.getParamsData();
      },
      handleInputConfirm(row){//input按下添加事件
        row.inputVisible = false;
         if(row.inputValue.trim().length===0){//处理输入框中的空格
        row.inputValue=''
        row.inputVisible=false
        return
     }
    row.attr_vals.push(row.inputValue.trim())//将添加成功的标签放到数组
    this.saveAttrVals(row)
     }, 
      async saveAttrVals(row){//保存此次操作的方法
        const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
            attr_name:row.attr_name,
            attr_sel:row.attr_sel,
            attr_vals:row.attr_vals.length==0 ?null:row.attr_vals.join(' ')
        })
        if(res.meta.status!==200){
             return this.$message.error("修改参数项失败")
        }
        this.$message.success("修改参数成功")
      },
      showInput(row){
    row.inputVisible = true;
    this.$nextTick(item=>{
    this.$refs.saveTagInput.$refs.input.focus(); 
    })  
      },
async handleChange(){
        this.getParamsData();
},
async getParamsData(){    //获取商品分类列表
    const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{sel:this.activeName}
    })
    console.log(res);
    if(res.meta.status!=200){
          return this.$message.error("获取商品分类列表失败")
    }
    res.data.forEach(item=>{
        item.attr_vals=item.attr_vals.split(",")//将字符串转换为数组
        //控制文本框的显示与隐藏
        item.inputVisible=false
        //文本框中输入的值
        item.inputValue=""
    })
    if(this.activeName=="many"){
        this.manytableData=res.data
    }else{
        this.onlytableData=res.data
    }
},
async getPramsList(){//获取商品分类
      const {data:res}=await this.$http.get("categories")
     if(res.meta.status!=200){
         return this.$message.error("获取商品分类失败")
     }
     this.cateList=res.data;
}
  },
  
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
      this.getPramsList();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
}

</script>
