import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {
  BootstrapVue, BIcon, BIconCheckCircle, BIconXCircle, BIconChevronLeft, BIconChevronRight,
} from 'bootstrap-vue';
import App from '@/App';

import router from '@/router';
import store from '@/store';
import messages from '@/i18n/messages';
import dateTimeFormats from '@/i18n/dateTimeFormats';
import VueGtag from 'vue-gtag';

import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.component('BIcon', BIcon);
Vue.component('BIconCheckCircle', BIconCheckCircle);
Vue.component('BIconXCircle', BIconXCircle);
Vue.component('BIconChevronLeft', BIconChevronLeft);
Vue.component('BIconChevronRight', BIconChevronRight);
Vue.use(VueI18n);

Vue.use(VueGtag, {
  config: { id: 'UA-165584402-1' },
  appName: 'fakenews-quiz',
  pageTrackerScreenviewEnabled: false,
}, router);

// Create VueI18n instance with options
const i18n = new VueI18n({
  fallbackLocale: 'en',
  locale: store.state.settings.language_code,
  messages,
  dateTimeFormats,
  silentTranslationWarn: true, // setting this to `true` hides warn messages about translation keys.
});

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
