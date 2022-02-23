<template>
  <div class=''>
                  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页
  </el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>修改商品 </el-breadcrumb-item>
</el-breadcrumb>
<el-card>
   <el-alert
   center
    title="消息提示的文案"
    type="info"
    show-icon>
  </el-alert>
  <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
</el-card>
<el-form :model="addForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="top">
  <el-tabs v-model="activeIndex" tab-position="left"  @tab-click="tabClick">
        <el-tab-pane label="基本信息" name="0" class="el-tab-pane">
            <el-form-item label="商品名称" prop="goods_name" >
    <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
         <el-form-item label="商品价格" prop="goods_price" >
    <el-input v-model="addForm.goods_price"></el-input>
      </el-form-item>
       <el-form-item label="商品重量" prop="goods_weight" >
    <el-input v-model="addForm.goods_weight"></el-input>
      </el-form-item>
         <el-form-item label="商品数量" prop="goods_number" >
    <el-input v-model="addForm.goods_number"></el-input>
      </el-form-item>
         <el-form-item label="商品分类" prop="goods_cat" >
    <el-cascader
    v-model="addForm.goods_cat"
    expand-trigger="hover"
    style="text-align:center"
    :options="cateList"
    :props="cateProps"
    @change="handleChange" 
> 
    </el-cascader>  
      </el-form-item>
        </el-tab-pane>
           <el-tab-pane label="商品参数" class="el-tab-pane" name="1" >
                    <el-form-item :label="item.attr_name" v-for="item in manytableData" :key="item.attr_id">
                      <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox :label="item1" v-for="(item1,index) in item.attr_vals" :key="index" border>
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
           </el-tab-pane> 
            <el-tab-pane label="商品属性" class="el-tab-pane" name="2" >
               <el-form-item :label="item.attr_name" v-for="item in onlytableData" :key="item.attr_id">
                 <el-input v-model="item.attr_vals"></el-input>
               </el-form-item>
           </el-tab-pane>
            <el-tab-pane label="商品图片" class="el-tab-pane" name="3" >
          
             <el-upload :action="uploadURL" :on-preview="handlePreview" :on-romove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
             </el-upload>
           </el-tab-pane>
            <el-tab-pane label="商品内容" class="el-tab-pane" name="4" >
              <quill-editor v-model="addForm.goods_introduce">
               
                </quill-editor> 
           </el-tab-pane>
             <el-tab-pane label="完成" class="el-tab-pane" name="5" >
    <el-button type="primary" class="btnAdd" @click="upd">修改商品</el-button>
  </el-tab-pane>
  </el-tabs>

</el-form>
<el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
  <img :src="previewPath" alt="" class="previewImg" width="100%"> 

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
fileList: [],
headerObj:{
  Authorization:window.localStorage.getItem("token")
},
uploadURL:'http://122.112.218.153:8893/api/private/v1/upload',
activeIndex:0,
addForm:{
goods_name:'',
goods_price:'',
goods_weight:'',
goods_number:'', 
good_cats:[],
attrs:[],
 pics:[],
goods_introduce:'',  

// goods_cat:[],
// goods_introduce:'',  
// pics:[],
// attrs:[]
},
cateList:[],
cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
        },
rules:{
    goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 1, max: 180, message: '长度在 1到 180 个字符', trigger: 'blur' }
          ],
            
            goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            { trigger: 'blur' }
          ],
           goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
            { trigger: 'blur' }
          ],
           goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' },
            { trigger: 'blur' }
          ],
},    
onlytableData:[],
manytableData:[],
previewPath:'',
previewVisible:false,
    }
  },
  // 监听属性 类似于data概念
  computed: {
    cateId(){
       if(this.addForm.goods_cat.length===3){
         return this.addForm.goods_cat[2]
    }
    return null
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
//    async upd(id){
//      console.log(id);
//          this.addForm.goods_cat=this.addForm.goods_cat.join(',')

//       const {data:res}=await this.$http.put('goods/'+this.$route.params.id,this.addForm)
//       this.$message.success('修改商品成功！')
//          this.$router.push('/goods')
//     },
// async tabClick(index){
//   if(this.activeIndex==1){
//     const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
//       params:{sel:'many'}
//     }) 
//     console.log(res);
    
//     res.data.forEach(item=>{
//      item.attr_vals=item.attr_vals==0 ? [] :item.attr_vals.split(",")//将字符串转换为数组
//     })
  
    
//     this.manytableData=res.data
//   }else if(this.activeIndex==='2'){
//     const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
//       params:{sel:'only'}
//     })
 
    
//     this.onlytableData=res.data
      
//   }
// },
async tabClick(){
  if(this.activeIndex==1){
    const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
      params:{
        sel:'many'
      }
    })
    res.data.forEach(item=>{
      attr_vals:item.attr_vals.split(',')
    })
    this.manytableData=res.data;
  }else{
     const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
      params:{
        sel:'only'
      }
    })
    this.onlytableData=res.data;
  }
},
async upd(id){
  this.addForm.goods_cat=this.addForm.goods_cat.join(",")
  const {data:res}=await this.$http.put("goods/"+this.$route.params.id,this.addForm)
 
    this.$message.success("修改成功");
  
  this.$router.push("/goods");
  
},
handleChange(){  

},
async getCateList(){
 const {data:res}=await this.$http.get("categories")
  console.log(res);
  
  this.cateList=res.data;
},
handlePreview(file){
  this.previewPath=file.url
  this.previewVisible=true
},
handleSuccess(response){
  //拼接得到一个图片信息对象
  const picInfo={ pic:response.data.tmp_path}
  //2.将图片信息对象 push到pics数组中
  this.addForm.pics.push(picInfo)
  console.log(this.addForm.pics);
  

}, 
handleRemove(){
  const filePath=file.response.data.tmp_path
  const i=this.addForm.pics.findIndex(x=> x.pic===filePath)
  this.addForm.pics.splice(i,1)
},
 
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
async  created () {
    // alert(this.$route.params.id);  
   
    const {data:res}=await this.$http.get("goods/"+this.$route.params.id);
    this.addForm=res.data;
    this.addForm.goods_cat=[this.addForm.cat_one_id,this.addForm.cat_two_id,this.addForm.cat_three_id];
  //   var {data:res}=await this.$http.get('goods/'+(this.$route.params.id));
  //   console.log(res);
  //  this.addForm= res.data;
  //   this.addForm.goods_cat=[this.addForm.cat_one_id,this.addForm.cat_two_id,this.addForm.cat_three_id]
    this.addForm.pics.forEach(element=>{
      this.fileList.push({url:'http://122.112.218.153:8893'+element.pics_sma})
    })
    this.getCateList();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },

}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
 .el-tab-pane{
text-align:left
 }
</style>
