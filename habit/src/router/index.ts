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
        key: 'add',
        icon: renderIcon(Add12Filled),
        component: () => import('../view/HabitView.vue')
    },
    {
        path: '/clock',
        label: "打卡",
        key: 'clock',
        icon: renderIcon(CheckboxArrowRight20Regular),
        component: () => import('../view/ClockView.vue')
    },
    {
        path: '/heatmap',
        label: "热力图",
        key: 'heatmap',
        icon: renderIcon(HeatMap),
        component: () => import('../view/HeatmapView.vue')
    },
    {
        path: '/calendar',
        label: "日历图",
        key: 'calendar',
        icon: renderIcon(Calendar),
        component: () => import('../view/CalendarView.vue')
    },
    {
        path: '/analysis',
        label: "数据分析",
        key: 'analysis',
        icon: renderIcon(Pulse20Regular),
        component: () => import('../view/DataAnalysisView.vue')
    },
    {
        path: '/tagManagement',
        label: "标签管理",
        key: 'tagManagement',
        icon: renderIcon(TagMultiple16Regular),
        component: () => import('../view/TagView.vue')
    },
    {
        path: '/history',
        label: "打卡历史",
        key: 'history',
        icon: renderIcon(ManageHistoryFilled),
        component: () => import('../view/ClockHistoryView.vue')
    },
    {
        path: '/archive',
        label: "归档",
        key: 'archive',
        icon: renderIcon(ArchiveMultiple16Regular),
        component: () => import('../view/HabitArchiveView.vue')
    },
    {
        path: '/setting',
        label: "设置",
        key: 'setting',
        icon: renderIcon(ManageAccountsOutlined),
        component: () => import('../view/PersonalSettingView.vue')
    },
]

export const menus: any [] = routes
    .filter(r => typeof r.label === 'string' && r.label.trim().length > 0)
    .map(r => ({
        ...r,
        label: () =>
            h(RouterLink, {to: {path: r.path}}, {default: () => r.label as string})
    }))


export default createRouter({history: createWebHistory(), routes})



