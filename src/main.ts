import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import province from '@/plugin/province'
import VueApexCharts from 'vue3-apexcharts'
const app = createApp(App)
app.use(router).use(province).use(VueApexCharts).use(
  createVuetify({
    components,
    directives
  })
)

app.mount('#app')
