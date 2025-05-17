  let apikey= mapToken ;
      maptilersdk.config.apiKey = apikey;
      console.log(apikey);
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.STREETS,
        center: [77.2090,28.6139], // starting position [lng, lat]
        zoom: 11, // starting zoom
      });
