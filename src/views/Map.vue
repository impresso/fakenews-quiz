<template>
  <div class="map">
    <h1>{{ $t('title') }}</h1>
    <MglMap
      class="map-container"
      :accessToken="accessToken"
      :mapStyle="mapStyle"
      :center="center"
      :zoom="zoom"
      :pitch="pitch"
      @load="onMapLoaded">
      <MglMarker :coordinates="coordinates" color="red" />
    </MglMap>
  </div>
</template>

<script>
// import Mapbox from 'mapbox-gl';
import { MglMap, MglMarker } from 'vue-mapbox';

export default {
  components: {
    MglMap,
    MglMarker,
  },
  data() {
    return {
      accessToken: 'pk.eyJ1IjoieW91dGFnIiwiYSI6ImRSbGY4dGMifQ.8qYcIzpevfAMjHmgRDesOA', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/youtag/ck862d77a07tj1iqdpr1kdua0', // your map style
      center: [6.1326, 49.8167],
      zoom: 8,
      pitch: 0,
      coordinates: [6.2, 49.8],
    };
  },
  created() {
    this.map = null;
  },
  methods: {
    onMapLoaded(event) {
      // in component
      this.map = event.map;
      this.map.scrollZoom.disable();
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
