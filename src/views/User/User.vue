<template>
  <div class=''>  
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页
  </el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表 </el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row :gutter="20">
  <el-col :span="8">
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
      <el-button slot="append" icon="el-icon-search" @click="getUserList">
          
      </el-button>
  </el-input>
  </el-col>

  <el-col :span="4">
      <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
  </el-col>
    </el-row>
    <el-table :data="userlist" border stripe style="width:100%">
    <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <el-table-column  prop="email" label="邮箱" ></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
       <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
<el-switch v-model="scope.row.mg_state" @change="userChange(scope.row)">
</el-switch>
            </template>
        </el-table-column>

        <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" icon="el-icon-edit"  @click="handleEdit(scope.row.id)"></el-button>
        <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row.id)"></el-button>
      <el-tooltip content="分配角色" placement="top" effect="dark" :enterable="false" >
    <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
    </el-tooltip>
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
</el-card>

<el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
  <el-form :model="addForm" :rules="rules" ref="ruleForm" label-width="100px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
   <el-form-item label="电话" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
  </span>
</el-dialog>

<el-dialog title="修改用户" :visible.sync="dialogVisible1" width="30%" :before-close="handleClose1">
  <el-form :model="updatForm" :rules="edrules" ref="edruleForm" label-width="100px">
  <el-form-item label="用户名" prop="username" >
    <el-input v-model="updatForm.username" disabled></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="updatForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机号" prop="mobile">
    <el-input v-model="updatForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose1">取 消</el-button>
    <el-button type="primary" @click="updata">确 定</el-button>
  </span>
</el-dialog>

<el-dialog title="用户权限" :visible.sync="dialogVisible2" width="30%" :before-close="handleClose2">
 
<div>
    <p>当前的用户：{{userInfo.username}}</p>
     <p>当前的角色：{{userInfo.role_name}}</p>
     <p>
         <el-select v-model="select1" placeholder="请选择">
         <el-option v-for="item in selist" :key="item.id" :label="item.roleName" :value="item.id">
         </el-option>
         </el-select>
         </p>
</div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose2">取 消</el-button>
    <el-button type="primary" @click="yes">确 定</el-button>
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
  //自定义验证
 
   var checkEmail=(rule,value,cb)=>{
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
   if(regEmail.test(value)){
       return cb()
   }
   cb(new Error('请输入合法的邮箱号'))
   }
   var checkMobile=(rule,value,cb)=>{
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
         if(regMobile.test(value)){
       return cb()
   }
   cb(new Error('请输入合法的手机号'))
   }
    return {
        userInfo:{},
        select1:0,
        selist:[],//角色数组
        queryInfo:{
            query:'',
            pagenum:1,
            pagesize:2,
        },
        dialogVisible1:false,
        dialogVisible:false,
         dialogVisible2:false,
        total:0,
        userlist:[],
        addForm:{
            username:'',
            password:'',
            email:'',
            mobile:''
        },
        updatForm:{},
        edrules:{},
        rules:{ 
              username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
              password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
          ],
            email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {validator:checkEmail, trigger: 'blur' }
          ],
            mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {validator:checkMobile ,trigger: 'blur' }
          ],

        }

    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
  handleClose2(){
   this.dialogVisible2=false;
  },
   async   yes(){
          if(!this.select1){
              return this.$message.error("请选择要分配的角色")
          }
          const {data:res }=await this.$http.put(`users/${this.userInfo.id}/role`,{
              rid:this.select1
          })
           if(res.meta.status !==200){
                 return this.$message.error("更新角色失败！")
            }
            this.$message.success("获取用户成功！")
            this.getUserList();
             this.dialogVisible2=false;
      },
   async  setRole(userinfo){
          this.userInfo=userinfo;
          const {data: res}=await this.$http.get('roles')
          console.log(res);
          
          if(res.meta.status !==200){
                 return this.$message.error("获取用户失败！")
            }
            this.selist=res.data;
            this.$message.success("获取用户成功！")
            this.dialogVisible2=true;

},

 async updata(){
    const {data: res}=await this.$http.put('users/' +this.updatForm.id,
    {
        email: this.updatForm.email,
        mobile: this.updatForm.mobile,
        username:this.updatForm.username

    })
     if(res.meta.status!==200){
                 return this.$message.error("修改用户失败！")
            }
            this.$message.success("修改用户成功！")
              this.getUserList();
            this.dialogVisible1=false;

},

       add(){
           this.$refs.ruleForm.validate(async valid=> {
               if(valid){
                  const { data: res }=await this.$http.post("users",this.addForm);
                  if(res.meta.status !==201){
                 return this.$message.error("添加用户失败！")
            }
            this.$message.success("添加用户成功！")
            this.addForm="";
              this.getUserList();
            this.dialogVisible=false;
               }
           })
      },
     async handleEdit(id){
         const { data: res }=await this.$http.get("users/" + id)
         if(res.meta.status !==200){
              return this.$message.error("查询用户失败！")
         }
         this.updatForm=res.data;
         this.dialogVisible1=true;
      }, 
      handleClose1(){
   
   this.dialogVisible1=false;  
  
      },
     handleClose(){
   this.$refs.ruleForm.resetFields();
   this.dialogVisible=false;
     },
      handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage;
          this.getUserList();
      },
      handleSizeChange(newSize){
          this.queryInfo.pagesize=newSize;
          this.getUserList();
      },
async getUserList(){
  const { data: res}=await this.$http.get("users",{
      params:this.queryInfo
  })

  if(res.meta.status !==200){
      return this.$message.error("获取用户列表失败！")
  }
  this.userlist=res.data.users;
  this.total=res.data.total;
},
     async handleDelete(id){
             const { data: res }=await this.$http.delete("users/"+id)
            console.log(res);
            if(res.meta.status !==200){
                 return this.$message.error("删除失败！")
            }
            this.$message.success("删除成功！");
            this.getUserList();
    },
     
     async userChange(row){
           const { data: res }=await this.$http.put('users/'+row.id+'/state/'+row.mg_state)
            if(res.meta.status !==200){
                row.mg_state=!row.mg_state
                 return this.$message.error("变更用户状态失败！")
            }
            this.$message.success("变更用户状态成功！")
      },

      },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
      this.getUserList()
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
<style lang='less' scoped>
// @import url(); 引入公共css类
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;

}

.el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.el-table {
    margin-top: 15px;
    font-size: 12px;
}

.el-pagination {
    margin-top: 15px;
}

</style>
