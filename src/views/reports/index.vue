  <template>
    <div class=''>
        <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页
    </el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
    <div id="main" style="width: 600px;height:400px;"></div>
    </div>
  </template>

  <script>
  // 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
  // 例如：import 《组件名称》 from '《组件路径》';
  import * as echarts from 'echarts'
  import _ from 'lodash'
  export default {
    // import引入的组件需要注入到对象中才能使用
    components: {},
    data () {
    // 这里存放数据
      return {
        
              options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
          
      }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    async mounted () {
    
      
      var myChart = echarts.init(document.getElementById('main'));
      const {data:res}=await this.$http.get("reports/type/1")
      console.log(res);
      var option=_.merge(res.data,this.options);
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
  }
  </script>


