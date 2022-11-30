import Vue from 'vue'
import VueRouter from 'vue-router'
import { setTitle, setSessionStorage, getStorage } from '@/libs/utils';

Vue.use(VueRouter)
const routes = [
    {
        path: '*',
        redirect: '/index'
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('./view/index'),
        meta: {
            title: '同协人力招聘',
            keepAlive: true
        }
    },
    {
        path: '/enroll/:id',
        name: 'enroll',
        component: () => import('./view/enroll'),
        meta: {
            title: '立即报名',
            keepAlive: false
        }
    },
    {
        path: '/information',
        name: 'information',
        component: () => import('./view/information'),
        meta: {
            title: '设置个人信息',
            keepAlive: false
        }
    },
    {
        path: '/my',
        name: 'my',
        component: () => import('./view/my'),
        meta: {
            title: '个人中心',
            keepAlive: false
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./view/login'),
        meta: {
            title: '登录',
            keepAlive: false
        }
    },
    {
        path: '/forget',
        name: 'forget',
        component: () => import('./view/forget'),
        meta: {
            title: '忘记密码',
            keepAlive: false
        },
    },
    {
        path: '/reset',
        name: 'reset',
        component: () => import('./view/reset'),
        meta: {
            title: '修改密码',
            keepAlive: false
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('./view/register'),
        meta: {
            title: '注册',
            keepAlive: false
        },
    },
    {
        path: '/product',
        name: 'product',
        component: () => import('./view/product'),
        meta: {
            title: '产品中心',
            keepAlive: false
        }
    },
    {
        path: '/agent',
        name: 'agent',
        component: () => import('./view/agent'),
        meta: {
            title: '邀请代理',
            keepAlive: false
        }
    },
    {
        path: '/achievement',
        name: 'achievement',
        component: () => import('./view/achievement'),
        meta: {
            title: '业绩',
            keepAlive: false
        }
    },
    {
        path: '/achievement-detail',
        name: 'achievement-detail',
        component: () => import('./view/achievement-detail'),
        meta: {
            title: '业绩详情',
            keepAlive: false
        }
    },
    {
        path: '/recommend',
        name: 'recommend',
        component: () => import('./view/recommend'),
        meta: {
            title: '产品推荐',
            keepAlive: false
        }
    },
    {
        path: '/enterprise',
        name: 'enterprise',
        component: () => import('./view/enterprise'),
        meta: {
            title: '实名认证',
            keepAlive: false
        }
    },
    {
        path: '/city',
        name: 'city',
        component: () => import('./view/city'),
        meta: {
            title: '城市推荐',
            keepAlive: false
        }
    },
    {
        path: '/detail/:id',
        name: 'detail',
        component: () => import('./view/detail'),
        meta: {
            title: '职位详情',
            keepAlive: true
        }
    },
    {
        path: '/rule',
        name: 'rule',
        component: () => import('./view/rule'),
        meta: {
            title: '佣金规则',
            keepAlive: false
        }
    },
    {
        path: '/commission',
        name: 'commission',
        component: () => import('./view/commission'),
        meta: {
            title: '我的佣金',
            keepAlive: false
        }
    },
    {
        path: '/receive',
        name: 'receive',
        component: () => import('./view/receive'),
        meta: {
            title: '领取',
            keepAlive: false
        }
    },
    {
        path: '/receiving-records',
        name: 'receiving-records',
        component: () => import('./view/receiving-records'),
        meta: {
            title: '领取记录',
            keepAlive: false
        },
    },
    {
        path: '/customer-search',
        name: 'customer-search',
        component: () => import('./view/customer-search'),
        meta: {
            title: '客户信息查询',
            keepAlive: false
        }
    },
    {
        path: '/customer-detail/:phone',
        name: 'customer-detail',
        component: () => import('./view/customer-detail'),
        meta: {
            title: '客户信息',
            keepAlive: false
        }
    },
    {
        path: '/assessment',
        name: 'assessment',
        component: () => import('./view/assessment'),
        meta: {
            title: '测额系统',
            keepAlive: false
        }
    },
    {
        path: '/join-register',
        name: 'join-register',
        component: () => import('./view/join-register'),
        meta: {
            title: '注册',
            keepAlive: false
        }
    },
    {
        path: '/404',
        name: 'error',
        component: () => import('./view/error'),
        meta: {
            title: '404找不到页面',
            keepAlive: false
        },
    },
]
// 路由配置 history-detail
const RouterConfig = {
     mode: 'history',
    routes: routes
}
export const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title
    const Token = getStorage('token')
    // const AgentGuid = Cookies.get('agentGuid')
    let tokenArr = ['login', 'register', 'forget', 'error']
    let loginArr = ['login', 'register', 'forget', 'error', 'join-register', 'recommend', 'assessment', 'index', 'detail', 'enroll']
    if(['index', 'detail', 'register'].includes(to.name)) {
        const { guid } = to.query
        guid && setSessionStorage('parentAgentGuid', guid)
    }
    if (!Token && !loginArr.includes(to.name)) {
        next({
            name: 'login',
            query: {
                redirect: to.path
            }
        })
    } else if (Token && tokenArr.includes(to.name)) {
        // 判断是否已经登录激活且前往的是登录页或者注册页或忘记密码页或激活重置密码页
        setTitle(title)
        next({
            name: 'my'
        })
    } else {
        setTitle(title)
        next()
    }
})
