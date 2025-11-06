import { createApp } from 'vue'
import VueECharts from 'vue-echarts'
import 'echarts'

import './style.css'
import App from './App.vue'
import router from './router'

createApp(App)
    .use(router)
    .component('v-chart', VueECharts)
    .mount('#app')
