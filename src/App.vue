<template>
  <div id="app">

    <div id="nav">
      <router-link to="/">Quiz</router-link> |
      <router-link to="/about">About</router-link>
    </div>

    <router-view/>

    <footer class="mt-5">
      <b-container class="bv-example-row">
        <b-row align-v="center">
          <b-col sm="3" md="4">
          </b-col>
          <b-col sm="6" md="4">
            <a href="https://impresso-project.ch/">
              <img src="https://impresso-project.ch/assets/images/logo-mobile.png"
                width="100%" alt="Impresso Logo">
            </a>
          </b-col>
          <b-col sm="3" md="4">
          </b-col>
        </b-row>
      </b-container>
      <p>
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  mounted() {
    document.title = this.$t('title');
  },
  methods: {
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
@import url('https://fonts.googleapis.com/css?family=Libre+Caslon+Text:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css?family=Dosis:wght@523&display=swap');
body {
  background-color: #eeeced !important;
}
#app {
  font-family: 'Lato', sans-serif;
  text-align: center;
  color: #51484d;
  height: 100vh;
}

footer {
  background: #000;
  color: white;
}

#nav {
  background: white;
  padding: 30px;
  a {
    font-weight: bold;
    color: #151515;
    text-transform: uppercase;
    padding: 0.1em  0.4em;
    &.router-link-exact-active {
      // color: #17a2b8;
      background: yellow;
    }
  }
}
.serif {
  font-family: 'Libre Caslon Text', serif;
}
</style>

<i18n>
{
  "en": {
    "title": "Fake News Quiz"
  }
}
</i18n>
