import {createRouter, createWebHistory, RouterLink} from 'vue-router'
import type {Component} from 'vue'
import {h} from 'vue'

import {NIcon} from 'naive-ui'
import {
    HeatMap,
    Calendar,
} from '@vicons/carbon'
import {
    Add12Filled,
    CheckboxArrowRight20Regular,
    Pulse20Regular,
    TagMultiple16Regular,
    ArchiveMultiple16Regular,
} from '@vicons/fluent'
import {
    ManageAccountsOutlined, ManageHistoryFilled,
} from '@vicons/material'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)})
}

const routes: any[] = [
    {
        path: '/',
        redirect: '/clock'
    },
    {
        path: '/add',
        label: "添加习惯",
        icon: renderIcon(Add12Filled),
        component: () => import('../view/HabitView.vue')
    },
    {
        path: '/clock',
        label: "打卡",
        icon: renderIcon(CheckboxArrowRight20Regular),
        component: () => import('../view/ClockView.vue')
    },
    {
        path: '/heatmap',
        label: "热力图",
        icon: renderIcon(HeatMap),
        component: () => import('../view/HeatmapView.vue')
    },
    {
        path: '/calendar',
        label: "日历图",
        icon: renderIcon(Calendar),
        component: () => import('../view/CalendarView.vue')
    },
    {
        path: '/analysis',
        label: "数据分析",
        icon: renderIcon(Pulse20Regular),
        component: () => import('../view/DataAnalysisView.vue')
    },
    {
        path: '/tagManagement',
        label: "标签管理",
        icon: renderIcon(TagMultiple16Regular),
        component: () => import('../view/TagView.vue')
    },
    {
        path: '/history',
        label: "打卡历史",
        icon: renderIcon(ManageHistoryFilled),
        component: () => import('../view/ClockHistoryView.vue')
    },
    {
        path: '/archive',
        label: "归档",
        icon: renderIcon(ArchiveMultiple16Regular),
        component: () => import('../view/HabitArchiveView.vue')
    },
    {
        path: '/setting',
        label: "设置",
        icon: renderIcon(ManageAccountsOutlined),
        component: () => import('../view/PersonalSettingView.vue')
    },
]

export const menus: any [] = routes
    .filter(r => typeof r.label === 'string' && r.label.trim().length > 0)
    .map(r => ({
        ...r,
        key: r.path,
        label: () =>
            h(RouterLink, {to: {path: r.path}}, {default: () => r.label as string})
    }))

const router = createRouter({history: createWebHistory(), routes});

export default router;

export function redirect(path: string) {
    router.push(path).then(() => {
    })
}

export function redirectLogin() {
    redirect('/setting');
}
