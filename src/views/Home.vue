<template>
  <div>
    <div class="about">
      <h1>{{ $t('title') }}</h1>
    </div>
    <div class="app-container">
      <div class="articles-container">
        <div class="date">
          {{ $d(new Date(current_article.date), 'long') }}
        </div>
        <h2 class="title">
          {{ current_article.title }}
        </h2>
        <div class="excerpt">
          {{ current_article.excerpt }}
        </div>
      </div>
      <div class="controls-container">
        <a class="controls left" href="#fake" @click="checkNews(false)">
          Fake !
        </a>
        <a class="controls" href="#pass" @click="checkNews()">
          Pass !
        </a>
        <a class="controls right" href="#auth" @click="checkNews(true)">
          Authentic !
        </a>
      </div>
    </div>
    <h1>Score : {{ score }}</h1>
  </div>
</template>

<script>

// import Vue from 'vue';
// import Vuex from 'vuex';
import json from '../data/news.json';

// Vue.use(Vuex);

// const store = new Vuex.Store({
//   state: {
//     answered: [],
//   },
//   mutations: {
//     addAnswered(state, payload) {
//       state.answered.push(payload.artNum);
//       console.log(state);
//     },
//   },
// });

export default {
  data: () => ({
    articles: json.articles,
    score: 0,
    rand: 0,
    answered: [],
  }),
  created() {
    this.shuffleArticles();
  },
  computed: {
    num_articles() {
      return this.articles.length;
    },
    current_article() {
      return this.articles[this.rand];
    },
  },
  methods: {
    shuffleArticles() {
      if (this.answered.length >= this.num_articles) {
        alert('all articles have been guessed');
        this.answered = [];
      } else {
        this.rand = Math.floor(Math.random() * this.num_articles);
        while (this.answered.includes(this.rand)) {
          this.rand = Math.floor(Math.random() * this.num_articles);
        }
      }
    },
    checkNews(answer) {
      // console.log(answer, this.articles[this.current_article].isFake);
      if (typeof answer !== 'undefined') {
        this.score += (answer === this.current_article.isFake) ? -10 : 10;
        // store.commit('addAnswered', {
        //   artNum: this.rand,
        // });
        this.answered.push(this.rand);
      }
      this.shuffleArticles();
    },
  },
};

</script>

<style lang="scss" media="screen">
  .app-container {
    border: 2px solid #white;
    max-width: 40rem;
    margin: auto;
    .articles-container {
      background-color: #eee;
      padding: 0.6em 2em;
      border: 2px inset rgba(0,0,0,0.2);
      overflow: hidden;
      .date {
        text-transform: uppercase;
        font-size: 80%;
        padding-bottom: 0.65em;
        border-bottom: 1px solid #ddd;
      }
      .title {

      }
      .excerpt {
        columns: 2;
        column-gap: 2em;
        text-align: left;
        overflow: hidden;
        display: block;
        font-size: 85%;
        // font-family: serif;
        line-height: 1.2em;
        height: 20em;
      }
    }
    .controls-container {
      display: flex;
      justify-content: stretch;
      border-top: 2px solid white;
      .controls {
        flex: 1;
        margin-right: 2px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 1rem;
        text-decoration: none;
        color: #333;
        border: 2px inset rgba(0,0,0,0.2);
        transition: all 0.2s;
        &:hover {
          border-color: rgba(0,0,0,0.8);
        }
        &.left {
          color: white;
          background-color: red;
        }
        &.center {
          background-color: #ddd;
        }
        &.right {
          color: white;
          background-color: #42b983;
          margin-right: 0;
        }
      }
    }
  }
</style>

<i18n>
{
  "en": {
    "title": "Fake articles Quiz: home"
  }
}
</i18n>
