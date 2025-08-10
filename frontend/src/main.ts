import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import { useAuth } from '../composables/Authentication/useAuth'

// Create vue app
const app = createApp(App)

const { loadUserFromStorage } = useAuth()
loadUserFromStorage()

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
