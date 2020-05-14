<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
    <footer>
      <!-- <p class="py-3">
        Click <a href="#" @click.prevent="disableTracking">here</a>,
        to disable the tracking through Google Analytics.
      </p> -->
    </footer>
  </div>
</template>

<script>
export default {
  mounted() {
    document.title = this.$t('title');
  },
  methods: {
    // disableTracking() {
    //   this.$ga.disable();
    //   alert('Tracking disabled');
    // },
  },
  watch: {
    $route(to) {
      document.title = to.name !== 'Home' ? `${to.name} — ${this.$t('title')}` : this.$t('title');
      this.$gtag.event('screen_view', {
        app_name: 'fakeNews',
        screen_name: to.name,
      });
    },
  },
};
</script>

<style lang="scss">
body {
  background-color: #2c3e5011 !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #17a2b8;
    }
  }
}
</style>

<i18n>
{
  "en": {
    "title": "Fake News Quiz"
  }
}
</i18n>
