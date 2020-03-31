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
        <div class="white">
          {{ $d(new Date(daystr), 'short') }}
        </div>
        <div class="label pt-2">Active Cases</div>
        <div class="bigdata cases">
          {{ $n(selected[daystr]) }}
        </div>
      </div>

    </div>


  </MglMap>

</div>
</template>

<script>
import { MglMap } from 'vue-mapbox';
import mapboxgl from 'mapbox-gl';
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
      center: [6.1326, 49.8167],
      zoom: 3,
      pitch: 0,
      coordinates: [6.2, 49.8],
      day: 0,
      playing: false,
      playInt: null,
      playingSpeed: 100,
      selected: {},
      days: [
        '1/22/20',
        '1/23/20',
        '1/24/20',
        '1/25/20',
        '1/26/20',
        '1/27/20',
        '1/28/20',
        '1/29/20',
        '1/30/20',
        '1/31/20',
        '2/1/20',
        '2/2/20',
        '2/3/20',
        '2/4/20',
        '2/5/20',
        '2/6/20',
        '2/7/20',
        '2/8/20',
        '2/9/20',
        '2/10/20',
        '2/11/20',
        '2/12/20',
        '2/13/20',
        '2/14/20',
        '2/15/20',
        '2/16/20',
        '2/17/20',
        '2/18/20',
        '2/19/20',
        '2/20/20',
        '2/21/20',
        '2/22/20',
        '2/23/20',
        '2/24/20',
        '2/25/20',
        '2/26/20',
        '2/27/20',
        '2/28/20',
        '2/29/20',
        '3/1/20',
        '3/2/20',
        '3/3/20',
        '3/4/20',
        '3/5/20',
        '3/6/20',
        '3/7/20',
        '3/8/20',
        '3/9/20',
        '3/10/20',
        '3/11/20',
        '3/12/20',
        '3/13/20',
        '3/14/20',
        '3/15/20',
        '3/16/20',
        '3/17/20',
        '3/18/20',
        '3/19/20',
        '3/20/20',
        '3/21/20',
        '3/22/20',
        '3/23/20',
        '3/24/20',
        '3/25/20',
        '3/26/20',
        '3/27/20',
        '3/28/20',
        '3/29/20',
      ],
    };
  },
  created() {
    this.map = null;
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
  computed: {
    daystr() {
      return this.days[this.day];
    },
  },
  methods: {
    keyhandler() {
      // do nothing
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
    togglePlay() {
      if (this.playing) {
        clearInterval(this.playInt);
        this.playing = false;
      } else {
        this.playInt = setInterval(() => {
          this.day += 1;
          if (this.day >= this.days.length) {
            this.day = 0;
          }
          this.updateMap();
        }, this.playingSpeed);
        this.playing = true;
      }
    },
    updateMap() {
      // console.log(this.daystr);
      // this.map.setFilter('data-heat', ['get', this.daystr]);
      // console.log('---', this.daystr);
      this.map.setPaintProperty('data-heat', 'heatmap-weight', ['get', this.daystr]);
      // this.map.setPaintProperty('data-point',
      // 'circle-radius', 10 + ['get', this.daystr] * 0.01);
      // this.selected = {};
      // this.selected.country = e.features[0].properties['Country/Region'];
      // this.selected.province = e.features[0].properties['Province/State'];
      // this.selected.activeCases = e.features[0].properties[this.daystr];
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
        data: '../data/time_series_covid19_confirmed_global.geojson',
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
            ['get', this.daystr],
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
      },
      'waterway-label');
      this.map.addLayer({
        id: 'data-point',
        type: 'circle',
        source: 'data',
        minzoom: 0,
        paint: {
          // Size circle radius by earthquake magnitude and zoom level
          'circle-radius': 6,
          'circle-color': 'rgba(0,0,0,0.2)',
          'circle-stroke-color': 'rgba(200,200,200,0.5)',
          'circle-stroke-width': 1,
        },
      },
      'waterway-label');

      this.map.on('mouseenter', 'data-point', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', 'data-point', () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('click', 'data-point', (e) => {
        this.map.flyTo({ center: e.features[0].geometry.coordinates });
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
