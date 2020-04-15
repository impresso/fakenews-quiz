<template>
  <div class="about">
    <!-- <h1>{{ $t('title') }}</h1> -->
    <div class="position-absolute ml-3" style="top:-4.8em; left:0">
      <h3 class="my-3">{{ answered.length + 1 }} / {{ num_articles }}</h3>
    </div>
    <div class="position-absolute mr-3" style="top:-4.8em; right:0">
      <h3 class="my-3">Score : {{ score }}</h3>
    </div>
    <div class="app-container">
      <div class="controls-container">
        <b-button-group class="my-4 w-100">
          <b-button variant="outline-primary" @click="checkNews(false)"
            :disabled="disableButtons">
            <b-icon icon="chevron-left"></b-icon> Fake !
          </b-button>
          <b-button variant="outline-secondary" @click="checkNews()">
            Pass !
          </b-button>
          <b-button variant="outline-primary" @click="checkNews(true)"
          :disabled="disableButtons">
            Authentic ! <b-icon icon="chevron-right"></b-icon>
          </b-button>
        </b-button-group>
      </div>
      <div class="articles-container">
        <div class="date p-3">
          {{ $d(new Date(current_article.date), 'long') }}
        </div>
        <h3 class="title px-4 pt-4">
          {{ current_article.title }}
        </h3>
        <div class="excerpt p-4">
          {{ current_article.excerpt }}
        </div>
      </div>
      <transition name="fadescale"
        v-on:after-enter="showFeedback = {}" v-on:after-leave="shuffleArticles">
        <div class="checkit success" v-show="showFeedback.success">
          <b-icon icon="check-circle" font-scale="5"></b-icon>
        </div>
      </transition>
      <transition name="fadescale"
        v-on:after-enter="showFeedback = {}" v-on:after-leave="shuffleArticles">
        <div class="checkit fail" v-show="showFeedback.fail">
          <b-icon icon="x-circle" font-scale="5"></b-icon>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>

import json from '../data/news.json';

export default {
  data: () => ({
    articles: json.articles,
    score: 0,
    rand: 0,
    answered: [],
    showFeedback: {},
    disableButtons: false,
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
      this.disableButtons = false;
    },
    checkNews(answer) {
      // console.log(answer, this.articles[this.current_article].isFake);
      if (typeof answer === 'undefined') {
        this.shuffleArticles();
      } else {
        this.disableButtons = true;
        if (answer === this.current_article.isFake) {
          this.showFeedback.fail = true;
          this.score -= 5;
        } else {
          this.showFeedback.success = true;
          this.score += 10;
        }
        this.answered.push(this.rand);
      }
    },
  },
};

</script>

<style lang="scss" media="screen">
  .about {
    position: relative;
    padding: 0 1em;
    max-width: 40rem;
    margin: auto;
  }
  .app-container {
    position: relative;
    border: 2px solid #white;
    .articles-container {
      background-color: #eee;
      border: 2px inset rgba(0,0,0,0.2);
      overflow: hidden;
      .date {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 80%;
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
        line-height: 1.2em;
      }
    }
    .checkit {
      position: absolute;
      width: 100%;
      top: 45%;
      left: 0;
      margin: 0 auto;
      &.success {
        color: #42b983;
      }
      &.fail {
        color: red;
      }
    }
  }
  .fadescale-enter-active {
    transition: all .2s ease-out;
  }
  .fadescale-leave-active {
    transition: all .8s ease-in;
  }
  .fadescale-enter-to {
    transform: scale(2.2);
    // transform: translateY(-20px);
  }
  .fadescale-leave-to {
    // transform: translateY(-60px);
    transform: scale(0.2);
    opacity: 0;
  }
</style>

<i18n>
{
  "en": {
    "title": "Fake articles Quiz: home"
  }
}
</i18n>
