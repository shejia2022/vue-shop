<template>
  <div class=''>
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页
  </el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表 </el-breadcrumb-item>
</el-breadcrumb>

<el-card>
   <el-row  :gutter="20">
       <el-col :span="4">
             <el-button type="primary" @click="dialogVisible = true" class="add">添加用户</el-button>
       </el-col>
       
   </el-row>
   <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
            <template slot-scope="scope">
            
              <el-row class="vcenter bottom" v-for="item1 in scope.row.children" :key="item1.id">
                <el-col :span="5">
                  <el-tag>
                    {{item1.authName}}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                 <el-col :span="19">
                  <el-row v-for="item2 in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRoles(scope.row,item2.id)">
                       {{item2.authName}}
                      </el-tag>
                    </el-col>
                     <el-col :span="18"  > 
                      <el-tag type="warning" closable @close="removeRoles(scope.row,item3.id)" v-for="item3 in item2.children" :key="item3.id">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
        </el-table-column>
         <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column  prop="roleDesc" label="角色描述" ></el-table-column>
      
         <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button icon="el-icon-edit"  @click="handleEdit(scope.row.id)">编辑</el-button>
        <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      <el-tooltip content="分配角色" placement="top" effect="dark" :enterable="false" >
    <el-button type="warning" icon="el-icon-setting" size="mini" @click="ShowRoles(scope.row)">分配权限</el-button>
    </el-tooltip>
      </template>
    </el-table-column>
   </el-table>
</el-card>
<el-dialog title="分配权限" :visible.sync="RolesdialogVisible" width="30%" :before-close="RoleshandleClose">
<el-tree :data="rightsList"
ref="treeRef"
  show-checkbox
  node-key="id"
  default-expand-all
  :default-checked-keys="defKeys"
  :props="defaultProps">
  </el-tree>
   <span slot="footer" class="dialog-footer">
    <el-button @click="RoleshandleClose">取 消</el-button>
    <el-button type="primary" @click="RolesYes">确 定</el-button>
  </span>
</el-dialog>
<el-dialog title="添加角色" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
   <el-form :model="addForm" :rules="rules" ref="ruleForm" label-width="100px">
       <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addForm.roleName"></el-input>
  </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addForm.roleDesc"></el-input>
  </el-form-item>

   </el-form>
     <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
  </span>
</el-dialog>
<el-dialog title="修改角色" :visible.sync="updDialogVisible" width="30%" :before-close="handleClose1">
   <el-form :model="updForm" :rules="rules" ref="ruleForm" label-width="100px">
       <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="updForm.roleName"></el-input>
  </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="updForm.roleDesc"></el-input>
  </el-form-item>

   </el-form>
     <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose1">取 消</el-button>
    <el-button type="primary" @click="update1">确 定</el-button>
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
      addForm:{
      roleDesc:'',
      roleName:''
      },
      updForm:{},
      defKeys:[],
      rolesList:[],
      RolesdialogVisible:false,
      updDialogVisible:false,
      dialogVisible:false,
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        rightsList:[],
        roleId:'',
        rules:{ 
              roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
             
            roleDesc: [
            { required: true, message: '请输入描述', trigger: 'blur' },
            { trigger: 'blur' }
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
    add(){
       this.$refs.ruleForm.validate(async valid=> {
          if(valid){
            const {data:res}=await this.$http.post("roles",this.addForm)
            if(res.meta.status!=201){
               return this.$message.error("添加角色失败！")
            }
              this.$message.success("添加角色成功！") 
              this.getRoles();
              this.dialogVisible=false;
          }
       })
    },
      
    async  handleEdit(id){//修改获取Id
          const {data:res}=await this.$http.get("roles/"+id)
           if(res.meta.status !==200){
              return this.$message.error("查询用户失败！");
         }
         console.log(res);
         
        this.updForm=res.data;
         this.updDialogVisible=true;
      },
   async update1(){
   const {data:res}=await this.$http.put('roles/'+this.updForm.roleId,
    {
        roleName: this.updForm.roleName,
        roleDesc: this.updForm.roleDesc,
    }) 
     if(res.meta.status!==200){
                 return this.$message.error("修改用户失败！")
            }
            this.$message.success("修改用户成功！")
            this.getRoles();
            this.updDialogVisible=false;
    },
      handleClose1(){
        this.updDialogVisible=false;
      },
  handleClose(){//添加关闭
   this.$refs.ruleForm.resetFields();
   this.dialogVisible=false;
     },
   async RolesYes(){
     //展开运算符
     var keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      const idstr=keys.join();
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,
      {
        rids:idstr
      })
      if(res.meta.status!=200){
        return this.$message.error("分配权限失败！")
      }
         this.$message.success("分配权限成功！") 
         this.getRoles();
         this.RolesdialogVisible=false;
      
  },

    RoleshandleClose(){
      this.defKeys=[];
      this.RolesdialogVisible=false;
    }, 
     async getRoles(){
          const {data:res}=await this.$http.get("roles")
          if(res.meta.status!==200){
                 return this.$message.error("获取角色列表失败！")
          }
          console.log(res);
          
          this.rolesList=res.data;
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
         const {data:res}=await this.$http.delete("roles/"+id);
        if(res.meta.status!=200){
              return this.$message.error("删除失败！")
        }
         this.$message.success("删除成功！");
         this.getRoles();
      },
     async ShowRoles(row){   
        this.roleId=row.id;
         const {data:res}=await this.$http.get("rights/tree")
         if(res.meta.status!=200){
            return this.$message.error("获取权限数据失败！")
         }
         this.rightsList=res.data;
         this.RolesdialogVisible=true;
         console.log(this.rightsList);
         for(var i=0;i<row.children.length;i++){
            var item1=row.children[i];
            for(var j=0;j<item1.children.length;j++){
              var item2=item1.children[j];
               for(var a=0;a<item2.children.length;a++){
              var item3=item2.children[a];
                this.defKeys.push(item3.id);
            }
            }
            

          }
         
         this.$message.success("获取权限数据成功！") 
      },
    async  removeRoles(row,rightId){
       const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)
        if(confirmResult!='confirm'){
          return this.$message.info("取消了删除!")
        }
        const {data:res}=await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
        if(res.meta.status!=200){
          return this.$message.error("删除权限失败！")
        }   
        row.children=res.data;
       this.$message.success("删除权限成功！") 
      }

  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
      this.getRoles();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },

}
</script>
<style lang='less' scoped>
.el-tag{
  margin: 10px;
}
.vcenter{//一级权限居中
  display: flex;
  align-items: center;
}
.bottom{
  border-bottom: 1px solid #eee
}
</style>