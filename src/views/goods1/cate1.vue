<template>
  <div class=''>
          <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-button @click="showAdd()">添加商品</el-button>
              <zk-table
      ref="table"
        index-text="#"
      :data="data"
      :columns="columns"
      :expand-type="false"
      :selection-type="false"
      >
      <template slot="likes" slot-scope="scope">
         <i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color:green"></i>
          <i class="el-icon-error" v-if="scope.row.cat_deleted==true" style="color:red"></i>
      </template>
      <template slot="dengji" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level==0" type="success">一级</el-tag>
           <el-tag v-if="scope.row.cat_level==1" type="info">二级</el-tag>
            <el-tag v-if="scope.row.cat_level==2">三级</el-tag>
      </template>
       <template slot="cz" slot-scope="scope">
        <el-button size="mini" icon="el-icon-edit"  @click="showAdd(scope.row.cat_id)">编辑</el-button>
        <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row.cat_id)">删除</el-button>
      </template>
      </zk-table>
               <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <el-form v-model="ruleForm">
          <el-form-item prop="cat_name">
            <el-input v-model="ruleForm.cat_name"></el-input>
          </el-form-item>
            <el-form-item prop="cat_level">
                        <el-cascader
                expand-trigger="hover"
                :props="props"
                :options="options"
                v-model="value"
                @change="handleChange"
                  change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </el-dialog>
              <el-dialog title="添加" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <el-form v-model="ruleForm">
          <el-form-item prop="cat_name">
            <el-input v-model="ruleForm.cat_name"></el-input>
          </el-form-item>
            <el-form-item prop="cat_level">
                        <el-cascader
                expand-trigger="hover"
                :props="props"
                :options="options"
                v-model="value"
                @change="handleChange"
                  change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </el-dialog>
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
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
        data:[],
      columns:[{
           label: '分类名称',
            prop: 'cat_name',
            width: '400px',
      },
        {
            label: '是否有效',
            prop: 'cat_deleted',
            type: 'template',
            template: 'likes',
          },
          {
            label: '等级',
            prop: 'cat_level',
            type: 'template',
            template: 'dengji',
          },
          {
            label: '操作',
            prop: 'caozuo',
            type: 'template',
            template: 'cz',
          }
     ],
        dialogVisible:false,
        options:[],
        value:[],
        props:{
             value: 'cat_id',
              label: 'cat_name'
        },
        queryInfo:{
            type:3,
            pagenum:1,
            pagesize:5
        },
        ruleForm:{
            cat_pid:0,
            cat_level:0,
            cat_name:'',
            cat_id:'',
        },
        dialogVisible:false,
        total:0,
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
      handleChange(){
         this.ruleForm.cat_pid=this.value[this.value.length-1];
          this.ruleForm.cat_level=this.value.length;
          // if(this.value.length==0){
          //   this.ruleForm.cat_pid=0;
          //   this.ruleForm.cat_level=0;
          // }else if(this.value.length==1){
          //      this.ruleForm.cat_pid=1;
          //   this.ruleForm.cat_level=this.value[0];
          // }else{
          //   this.ruleForm.cat_pid=2;
          //   this.ruleForm.cat_level=this.value[1];
          // }
      },
      handleClose(){
          this.dialogVisible=false;
      },

     async add(){
         if(this.ruleForm.cat_id){
             const {data:res}=await this.$http.put("categories/"+this.ruleForm.cat_id,this.ruleForm)
             console.log(res);
             if(res.meta.status!=200){
                 return this.$message.error("修改失败");
             }
             this.$message.success("修改成功")
             this.ruleForm.cat_id='';
             this.ruleForm.cat_name='';
         }else{
          const {data:res}=await this.$http.post("categories",this.ruleForm)
          console.log(res);
          
           if(res.meta.status!=201){
                 return this.$message.error("新增失败");
             }
             this.$message.success("新增成功")
         }

            this.dialogVisible=false;
            this.getCateList();
      },
      handleSizeChange(size){
          this.queryInfo.pagesize=size;
          this.getCateList();
      },
      handleCurrentChange(num){
         this.queryInfo.pagenum=num;
         this.getCateList();
      },
     async getCate(){
            const {data:res}=await this.$http.get("categories")
            this.options=res.data;
      },
     async getCateList(){
           const {data:res}=await this.$http.get("categories",{
               params:this.queryInfo
           })   
           console.log(res);
           
           this.data=res.data.result;
           this.total=res.data.total;
      },
    async  showAdd(id){
          this.dialogVisible=true;
        if(id){
        const {data:res}=await this.$http.get("categories/"+id)
        console.log(res);
        this.ruleForm.cat_id=res.data.cat_id;
        this.ruleForm.cat_name=res.data.cat_name;
        this.ruleForm.cat_pid=res.data.cat_pid;
        if(res.data.cat_level==1){
            this.value=[res.data.cat_pid]
        }else if(res.data.cat_level==2){
              const {data:res1}=await this.$http.get("categories/"+res.data.cat_pid)
              this.value=[res1.data.cat_pid,res.data.cat_pid]
        }
        }
      },
     async handleDelete(id){
          const {data:res}=await this.$http.delete(`categories/${id}`)
          console.log(res);
          
          if(res.meta.status!=200){ 
              return this.$message.error('刪除失败！')
          }
          this.$message.success('删除成功！')
          this.getCateList();
      },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
      this.getCateList();
      this.getCate();
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

</style>
