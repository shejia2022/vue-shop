import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import login from './views/login.vue'
import user from './views/User/User.vue'
import rights from './views/Power/Rights.vue'
import roles from './views/Power/Roles.vue'
import cate from './views/goods1/Cate.vue'
import cate1 from './views/goods1/cate1.vue'
import params from './views/goods1/params.vue'
import goods from './views/goods1/goods.vue'
import add from './views/goods1/add.vue'
import reports from './views/reports'
import update from './views/goods1/updata.vue'
Vue.use(Router)

const router = new Router({
        routes: [{
                path: '/',
                redirect: '/login',
            },
            {
                path: '/home',
                name: 'home',
                component: Home,
                children: [{
                        path: '/rights',
                        name: 'rights',
                        component: rights
                    },
                    {
                        path: '/roles',
                        name: 'roles',
                        component: roles
                    }, {
                        path: '/users',
                        name: 'user',
                        component: user
                    },
                    {
                        path: '/categories',
                        name: 'cate',
                        component: cate
                    },
                    {
                        path: '/categories1',
                        name: 'cate1',
                        component: cate1
                    },
                    {
                        path: '/params',
                        name: 'params',
                        component: params
                    },
                    {
                        path: '/reports',
                        name: 'reports',
                        component: reports
                    },
                    {
                        path: '/goods',
                        name: 'goods',
                        component: goods,
                    },
                    {
                        path: '/goods/add',
                        name: 'add',
                        component: add
                    },
                    {
                        path: '/goods1/update/:id',
                        name: 'update',
                        component: update
                    }


                ]
            },
            {
                path: '/login',
                name: 'login',
                component: login
            },



        ]
    })
    // router.beforeEach((to, from, next) => {
    //     //???????????? ?????????????????????
    //     var token = localStorage.getItem("token")
    //         //????????????
    //     if (token) { //?????????????????????????????????
    //         if (to.path == "/login") {
    //             next("/home")
    //             return;
    //         }
    //     }
    //     if (to.path == "/login") {
    //         next();
    //     } else {
    //         if (token) {
    //             next(); //????????????
    //         } else {
    //             next("/login");
    //         }
    //     }

// })

export default router