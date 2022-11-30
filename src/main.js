import Vue from 'vue';
import App from './App';
import { router } from './router';
import 'amfe-flexible';
import VueClipboard from 'vue-clipboard2'
import { Lazyload } from 'vant';
import { setSessionStorage } from '@/libs/utils'
setSessionStorage('iosUrl', window.location.href)
Vue.use(VueClipboard)
Vue.use(Lazyload, {
    preLoad: 1.3,
    attempt: 3
})
new Vue({
  router,
  el: '#app',
  render: h => h(App)
});
