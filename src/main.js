import Vue from 'vue'
import App from './App.vue'
import router from './router'


import ElementUI from 'element-ui';
import './assets/css/index.css';
import VueQuillEditor from 'vue-quill-editor'
import 'element-ui/lib/theme-chalk/index.css';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(ElementUI)
import ZkTable from 'vue-table-with-tree-grid'


Vue.use(ZkTable)
Vue.filter('dataFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.use(VueQuillEditor)
import axios from './util/request1';
Vue.prototype.$http = axios

Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')