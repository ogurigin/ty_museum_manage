import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/userList',
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/userList',
                name: 'userList',
                meta: {
                    title: '用户列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/userMangenent/userList/index.vue'),
            },
            {
                path: '/orgList',
                name: 'orgList',
                meta: {
                    title: '企业列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/userMangenent/orgList/index.vue'),
            },
            {
                path: '/banner',
                name: 'banner',
                meta: {
                    title: 'Banner列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/operationMangenent/banner/index.vue'),
            },
            {
                path: '/commodityDelivty',
                name: 'commodityDelivty',
                meta: {
                    title: '商品投放',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/operationMangenent/commodityDelivty/index.vue'),
            },
            {
                path: '/commodityWindow',
                name: 'commodityWindow',
                meta: {
                    title: '商品橱窗',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/operationMangenent/commodityWindow/index.vue'),
            },
            {
                path: '/examineVerify',
                name: 'examineVerify',
                meta: {
                    title: '审核列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/conmentMangenent/examineVerify/index.vue'),
            },
            {
                path: '/conmentTable',
                name: 'conmentTable',
                meta: {
                    title: '内容列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/conmentMangenent/conmentTable/index.vue'),
            },
            {
                path: '/venueTab',
                name: 'venueTab',
                meta: {
                    title: '场馆列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/VenueManagement/VenueTab/index.vue'),
            },
            {
                path: '/venueType',
                name: 'venueType',
                meta: {
                    title: '场馆类型',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/VenueManagement/VenueType/index.vue'),
            },
            {
                path: '/videoTab',
                name: 'videoTab',
                meta: {
                    title: '场馆类型',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/videoGuide/videoTab/index.vue'),
            },
            {
                path: '/guideType',
                name: 'guideType',
                meta: {
                    title: '导览类型',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/videoGuide/guideType/index.vue'),
            },
            {
                path: '/tabs',
                name: 'tabs',
                meta: {
                    title: 'tab标签',
                   
                },
                component: () => import(/* webpackChunkName: "tabs" */ '../views/tabs.vue'),
            },
            {
                path: '/supplyList',
                name: 'supplyList',
                meta: {
                    title: '供应链列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/supplyChain/supplyList/index.vue'),
            },
            {
                path: '/exchangeList',
                name: 'exchangeList',
                meta: {
                    title: '展览交流',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/exhibitionExchange/exchangeList/index.vue'),
            },
            {
                path: '/vipList',
                name: 'vipList',
                meta: {
                    title: '会员列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/vipManagement/vipList/index.vue'),
            },
            {
                path: '/vipOrderList',
                name: 'vipOrderList',
                meta: {
                    title: '会员订单',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/orderManagement/vipOrderList/index.vue'),
            },
            {
                path: '/tgOrderList',
                name: 'tgOrderList',
                meta: {
                    title: '推广订单',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/orderManagement/tgOrderList/index.vue'),
            },
            {
                path: '/goodsOrderList',
                name: 'goodsOrderList',
                meta: {
                    title: '商品订单',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/orderManagement/goodsOrderList/index.vue'),
            },
            {
                path: '/goodsTab',
                name: 'goodsTab',
                meta: {
                    title: '商品列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/goodsMangement/goodsTab/index.vue'),
            },
            {
                path: '/goodsType',
                name: 'goodsType',
                meta: {
                    title: '商品类型',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/goodsMangement/goodsType/index.vue'),
            },
            {
                path: '/CommodityReports',
                name: 'CommodityReports',
                meta: {
                    title: '商品报表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/ReportManagement/CommodityReports/index.vue'),
            },
            {
                path: '/TicketStatements',
                name: 'TicketStatements',
                meta: {
                    title: '门票报表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/ReportManagement/TicketStatements/index.vue'),
            },
            {
                path: '/tgt',
                name: 'tgt',
                meta: {
                    title: '推广通',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/merchantCenter/tgt/index.vue'),
            },{
                path: '/appMarketplace',
                name: 'appMarketplace',
                meta: {
                    title: '应用市场',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/merchantCenter/appMarketplace/index.vue'),
            },{
                path: '/businessAdvice',
                name: 'businessAdvice',
                meta: {
                    title: '经营建议',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/merchantCenter/businessAdvice/index.vue'),
            },{
                path: '/musicList',
                name: 'musicList',
                meta: {
                    title: '音频列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/musicMangenent/musicList/index.vue'),
            }
            ,{
                path: '/threeD',
                name: 'threeD',
                meta: {
                    title: '文物列表',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/threeD/list/index.vue'),
            },{
                path: '/culturalType',
                name: 'culturalType',
                meta: {
                    title: '文物分类',
                    hidden:true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/threeD/culturalType/index.vue'),
            }
            ,{
                path: '/PASSCardList',
                name: 'PASSCardList',
                meta: {
                    title: 'PASS卡列表',
                    hidden:true,
                },
                component: () => import('../views/PASSCard/PASSCardList/index.vue'),
            },{
                path: '/passActivityList',
                name: 'passActivityList',
                meta: {
                    title: '优惠活动',
                    hidden:true,
                },
                component: () => import('../views/PASSCard/activity/list.vue'),
            },
            // {
            //     path: '/creatorList',
            //     name: 'creatorList',
            //     meta: {
            //         title: '创作者列表',
            //         hidden:true,
            //     },
            //     component: () => import('../views/PASSCard/creatorList/index.vue'),
            // },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
    {
        path: '/404',
        name: '404',
        meta: {
            title: ' 不存在',
            permiss:404,
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/404.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const role = sessionStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    }else {
        next();
    }
});

export default router;
