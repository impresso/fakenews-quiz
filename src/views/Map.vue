<template>
<div class="map">
  <h1>{{ $t('title') }}</h1>
  <MglMap class="map-container"
    :accessToken="accessToken"
    :mapStyle="mapStyle" :center="center"
    :zoom="zoom"
    :pitch="pitch"
    @load="onMapLoaded">

    <div class="position-absolute width-25 m-2">
      <b-form-input
        id="daterange"
        type="range"
        v-model="day"
        @change="updateMap()"
        @keydown="keyhandler"
        @keyup="keyhandler"
        min="0" :max="days.length - 1" />
      <b-input-group>
        <b-input-group-prepend>
          <b-button @click="prevDay()" :disabled="day < 1">
            <b-icon-arrow-left />
          </b-button>
          <b-button @click="togglePlay()" :variant="playing ? 'danger' : 'success'">
            <div v-if="playing">
              <b-icon-pause />
            </div>
            <div v-else>
              <b-icon-play />
            </div>
          </b-button>
        </b-input-group-prepend>
        <b-form-input type="number"
          :value="day" v-model="day"
          @change="updateMap()" min="0" :max="days.length - 1" style="border: none" />
        <b-input-group-append>
          <b-button @click="nextDay()" :disabled="day >= (days.length - 1)">
            <b-icon-arrow-right />
          </b-button>
        </b-input-group-append>
      </b-input-group>

      <div class="selectedBox mt-3" :class="Object.keys(selected).length === 0 ? 'hidden' : ''">
        <div class="label">Location</div>
        <div class="country">
          <span v-if="selected['Province/State'] !== ''">{{ selected['Province/State'] }}, </span>
          {{ selected['Country/Region'] }}
        </div>
        <div class="label pt-2">Date</div>
        <div v-if="today && today.length > 1" class="white">
          {{ $d(new Date(today), 'short') }}
        </div>
        <div class="label pt-2">Active Cases</div>
        <div class="bigdata cases">
          {{ $n(selected[today]) }}
        </div>
      </div>

    </div>


  </MglMap>

</div>
</template>

<script>
import { MglMap } from 'vue-mapbox';
import mapboxgl from 'mapbox-gl';
import csv2geojson from 'csv2geojson';
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  components: {
    MglMap,
  },
  data() {
    return {
      accessToken: 'pk.eyJ1IjoieW91dGFnIiwiYSI6ImRSbGY4dGMifQ.8qYcIzpevfAMjHmgRDesOA',
      mapStyle: 'mapbox://styles/youtag/ck86560ex000c1ims4chreaqo',
      dataUrl: {
        confirmed_global: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
        deaths_global: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
        confirmed_US: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv',
        deaths_US: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv',
      },
      center: [6.1326, 49.8167],
      zoom: 3,
      pitch: 0,
      coordinates: [6.2, 49.8],
      day: 0,
      days: [],
      playing: false,
      playInt: null,
      playingSpeed: 100,
      selected: {},
      geoJson: {},
    };
  },
  created() {
    fetch(this.dataUrl.confirmed_global)
      .then((response) => response.text())
      .then((csvString) => {
        this.days = csvString.split('\n', 1)[0].split(',').slice(4);
        // console.log(csvString);
        csv2geojson.csv2geojson(csvString, {
          numericFields: this.days.join(','),
        }, (err, data) => {
          this.geoJson = data;
          // populate days array
          // Object.keys(data.features[0].properties).forEach((item) => {
          //   if (!['Province/State', 'Country/Region'].includes(item)) {
          //     this.days.push(item);
          //   }
          // });

          // populate geoJson object
          // this.geoJson = {
          //   ...data,
          // };
          // data.features.forEach((feature, i) => {
          //   this.days.forEach((day) => {
          //     this.geoJson.features[i].properties[day] = Number(feature.properties[day]);
          //   });
          // });
        });
      });
    this.map = null;
    this.keyhandler();
  },
  computed: {
    today() {
      return this.days[this.day];
    },
  },
  methods: {
    keyhandler() {
      window.addEventListener('keyup', (e) => {
        // hit space to play !!!
        if (e.keyCode === 32) {
          this.togglePlay();
        } else if (e.keyCode === 37) {
          this.prevDay();
        } else if (e.keyCode === 39) {
          this.nextDay();
        }
        // console.log(e.keyCode);
      });
    },
    nextDay() {
      if (this.day < (this.days.length - 1)) {
        this.day += 1;
        this.updateMap();
      }
    },
    prevDay() {
      if (this.day > 0) {
        this.day -= 1;
        this.updateMap();
      }
    },
    deSelect() {
      this.selected = {};
    },
    pause() {
      clearInterval(this.playInt);
      this.playing = false;
    },
    togglePlay() {
      if (this.playing) {
        this.pause();
      } else {
        if (this.day >= (this.days.length - 1)) {
          this.day = 0;
        }
        this.playInt = setInterval(() => {
          if (this.day >= (this.days.length - 1)) {
            this.pause();
          } else {
            this.day += 1;
            this.updateMap();
          }
        }, this.playingSpeed);
        this.playing = true;
      }
    },
    updateMap() {
      // console.log(this.today);
      // this.map.setFilter('data-heat', ['get', this.today]);
      // console.log('---', this.today);
      this.map.setPaintProperty('data-heat', 'heatmap-weight', ['get', this.today]);
      // this.map.setPaintProperty('data-point',
      // 'circle-radius', 10 + ['get', this.today] * 0.01);
      // this.selected = {};
      // this.selected.country = e.features[0].properties['Country/Region'];
      // this.selected.province = e.features[0].properties['Province/State'];
      // this.selected.activeCases = e.features[0].properties[this.today];
    },
    onMapLoaded(event) {
      // in component
      this.map = event.map;
      // this.map.scrollZoom.disable();
      this.map.addControl(new mapboxgl.NavigationControl());
      // this.map.addControl(new mapboxgl.FullscreenControl());
      this.map.getCanvas().addEventListener('click', () => {
        this.deSelect();
      });

      this.map.scrollZoom.disable();
      this.map.addSource('data', {
        type: 'geojson',
        data: this.geoJson,
      });
      this.map.addLayer({
        id: 'data-heat',
        type: 'heatmap',
        source: 'data',
        maxzoom: 9,
        paint: {
          // Increase the heatmap weight based on frequency and property magnitude
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', this.today],
            0,
            0,
            6,
            1,
          ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            1,
            9,
            3,
          ],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(236,222,239,0)',
            0.2, 'rgb(208,209,230)',
            0.4, 'rgb(166,189,219)',
            0.6, 'rgb(103,169,207)',
            0.8, 'rgb(28,144,153)',
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            2,
            9,
            50,
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            1,
            9,
            0,
          ],
        },
      });
      this.map.addLayer({
        id: 'data-point',
        type: 'circle',
        source: 'data',
        minzoom: 0,
        paint: {
          // Size circle radius by earthquake magnitude and zoom level
          'circle-radius': 4,
          'circle-color': 'rgba(0,0,0,0.2)',
          'circle-stroke-color': 'rgba(200,200,200,0.5)',
          'circle-stroke-width': 1,
        },
      });

      this.map.on('mouseenter', 'data-point', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', 'data-point', () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('click', 'data-point', (e) => {
        // this.map.flyTo({ center: e.features[0].geometry.coordinates });
        this.selected = e.features[0].properties;
        // console.log(this.selected);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.map-container {
  height: 100vh;
}
.hidden {
  opacity: 0;
  transform: scale(0.8);
}
.selectedBox {
    padding: 1em;
    color: mintcream;
    background-color: rgba(0,0,0,0.1);
    border: 1px solid rgba(0,0,0,0.2);
    transition: all 400ms;
    .label {
      font-weight: bold;
      font-size: 65%;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #999;
    }
    .bigdata {
      font-size: 300%;
      line-height: 1;
    }
}
.white {
  color: white;
}
</style>

<i18n>
{
  "en": {
    "title": "COVID-19 monitoring: Map"
  }
}
</i18n>
