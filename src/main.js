import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import App from '@/App';

import router from '@/router';
import store from '@/store';
import messages from '@/i18n/messages';
import dateTimeFormats from '@/i18n/dateTimeFormats';

import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueI18n);

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
