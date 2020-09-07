import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Sidebar from './components/Sidebar'

Vue.config.productionTip = false

Vue.component('Sidebar',Sidebar)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

