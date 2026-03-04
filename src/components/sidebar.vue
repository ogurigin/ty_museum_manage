<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-sub-menu :index="item.index" :key="item.index">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-sub-menu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';

const items = [
    {
        icon: 'Calendar',
        index: '1',
        title: '用户管理',
        subs: [
            {
                index: '/userList',
                title: '用户列表',
            },
            {
                index: '/orgList',
                title: '企业列表',
            },
        ],
    },
    {
        icon: 'DocumentCopy',
        index: '2',
        title: '运营管理',
        subs: [
            {
                index: '/banner',
                title: 'Banner列表',
            },
            {
                index: '/commodityWindow',
                title: '商品橱窗',
            },
            {
                index: '/commodityDelivty',
                title: '商品投放',
            },
        ],
    },
    {
        icon: 'Edit',
        index: '3',
        title: '内容管理',
        subs: [
            {
                index: '/examineVerify',
                title: '审核列表',
            },
            {
                index: '/conmentTable',
                title: '内容列表',
            },
        ],
    },
    {
        icon: 'Odometer',
        index: '4',
        title: '场馆管理',
        subs: [
            {
                index: '/venueTab',
                title: '场馆列表',
            },
            {
                index: '/venueType',
                title: '场馆类型',
            },
        ],
    },
    {
        icon: 'Setting',
        index: '5',
        title: '视频导览',
        subs: [
            {
                index: '/videoTab',
                title: '视频列表',
            },
            {
                index: '/guideType',
                title: '导览类型',
            },
        ],
    },
    {
        icon: 'GobletFull',
        index: '6',
        title: '会员管理',
        subs: [
            {
                index: '/vipList',
                title: '会员列表',
            },
        ],
    },
    {
        icon: 'DocumentCopy',
        index: '7',
        title: '订单管理',
        subs: [
            {
                index: '/vipOrderList',
                title: '会员订单',
            },
            {
                index: '/tgOrderList',
                title: '推广订单',
            },
            {
                index: '/goodsOrderList',
                title: '商品订单',
            },
        ],
    },
    {
        icon: 'Goods',
        index: '8',
        title: '商品管理',
        subs: [
            {
                index: '/goodsTab',
                title: '商品列表',
            },
            {
                index: '/goodsType',
                title: '商品类型',
            },
        ],
    },
    {
        icon: 'Tickets',
        index: '14',
        title: '报表管理',
        subs: [
            {
                index: '/CommodityReports',
                title: '商品报表',
            },
            {
                index: '/TicketStatements',
                title: '门票报表',
            },
        ],
    },
    {
        icon: 'ShoppingCart',
        index: '9',
        title: '商家中心',
        subs: [
            {
                index: '/tgt',
                title: '推广通',
            },
            {
                index: '/appMarketplace',
                title: '应用市场',
            },{
                index: '/businessAdvice',
                title: '经营建议',
            },
        ],
    },
    {
        icon: 'DataLine',
        index: '10',
        title: '展览交流',
        subs: [
            {
                index: '/exchangeList',
                title: '展览列表',
            },
        ],
    },
    {
        icon: 'Coin',
        index: '11',
        title: '供应链',
        subs: [
            {
                index: '/supplyList',
                title: '供应链列表',
            },
        ],
    }, {
        icon: 'Headset',
        index: '12',
        title: '音频管理',
        subs: [
            {
                index: '/musicList',
                title: '音频列表',
            },
        ],
    },
    {
        icon: 'DocumentCopy',
        index: '/tabs',
        title: '消息管理',
    },
    {
        icon: 'Box',
        index: '13',
        title: '3D文物',
        subs: [
            {
                index: '/threeD',
                title: '文物列表',
            },
            {
                index: '/culturalType',
                title: '文物分类',
            },
        ],
    },
     {
        icon: 'Postcard',
        index: '15',
        title: 'PASS卡管理',
        subs: [
            {
                index: '/PASSCardList',
                title: 'PASS卡列表',
            },
            {
                index: '/passActivityList',
                title: '优惠活动',
            },
            // {
            //     index: '/creatorList',
            //     title: '创作者列表',
            // },
        ],
    },
] as any;

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
