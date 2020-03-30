<template>
<div class="map">
  <h1>{{ $t('title') }}</h1>
  <MglMap class="map-container"
    :accessToken="accessToken"
    :mapStyle="mapStyle" :center="center"
    :zoom="zoom"
    :pitch="pitch"
    @load="onMapLoaded">
  </MglMap>
  <div>
    <label for="daterange">Slide dates</label>
    <b-form-input
      id="daterange"
      type="range"
      v-model="sliderValue"
      @change="changeDate()"
      min="0" :max="dates.length - 1" />

      <b-button @click="togglePlay()">
        <span v-if="playing">Pause</span><span v-else>Play</span></b-button>

    <div class="mt-2">Day: {{ sliderValue }} – Date {{ dateStr }}</div>
  </div>
</div>
</template>

<script>
// import Mapbox from 'mapbox-gl';
import {
  MglMap,
} from 'vue-mapbox';
import mapboxgl from 'mapbox-gl';

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
      sliderValue: 2,
      playing: false,
      playInt: null,
      dates: [
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
    window.addEventListener('keypress', (e) => {
      // hit space to play !!!
      if (e.keyCode === 32) {
        this.togglePlay();
      }
    });
  },
  computed: {
    dateStr() {
      return this.dates[this.sliderValue];
    },
  },
  methods: {
    togglePlay() {
      if (this.playing) {
        clearInterval(this.playInt);
        this.playing = false;
      } else {
        this.playInt = setInterval(() => {
          this.sliderValue += 1;
          if (this.sliderValue >= this.dates.length) {
            this.sliderValue = 0;
          }
          this.changeDate();
        }, 20);
        this.playing = true;
      }
    },
    changeDate() {
      // console.log(this.dateStr);
      // this.map.setFilter('data-heat', ['get', this.dateStr]);
      this.map.setPaintProperty('data-heat', 'heatmap-weight', ['get', this.dateStr]);
      // this.map.setPaintProperty('data-point',
      // 'circle-radius', 10 + ['get', this.dateStr] * 0.01);
    },
    day() {
      // if (this.map.getSource('data') && this.map.isSourceLoaded('data')) {
      //   const d = this.map.querySourceFeatures('data');
      //   console.log('source loaded!', d);
      //   return Object.keys(d.features[0].properties)[this.sliderValue];
      // }
      return '3/18/20';
    },
    onMapLoaded(event) {
      // in component
      this.map = event.map;
      // this.map.scrollZoom.disable();

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
            ['get', this.dateStr],
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
          'circle-radius': 2,
          'circle-color': 'rgba(0,0,0,0.2)',
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          // Transition from heatmap to circle layer by zoom level
          // 'circle-opacity': [
          //   'interpolate',
          //   ['linear'],
          //   ['zoom'],
          //   7,
          //   0,
          //   8,
          //   1,
          // ],
        },
      },
      'waterway-label');

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
      });
      this.map.on('mouseenter', 'data-point', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', 'data-point', () => {
        this.map.getCanvas().style.cursor = '';
      });
      this.map.on('click', 'data-point', (e) => {
        // Change the cursor style as a UI indicator.
        // this.map.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = `<div class="label">${e.features[0].properties['Country/Region']}</div>
           ${this.dateStr} : <b>${e.features[0].properties[this.dateStr]} cases</b>`;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        // console.log(e.features[0].properties['3/29/20']);
        popup
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.map);
      });
    },
  },
};
</script>

<style lang="scss">
.map-container {
    height: 75vh;
}
</style>

<i18n>
{
  "en": {
    "title": "COVID-19 monitoring: Map"
  }
}
</i18n>
