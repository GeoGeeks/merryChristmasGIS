require([
    'Canvas-Flowmap-Layer/CanvasFlowmapLayer',
    'esri/Graphic',
    "esri/WebMap",
    'esri/Map',
    'esri/views/MapView',
    'dojo/json',
    'dojo/domReady!'
  ], function(
    CanvasFlowmapLayer,
    Graphic,
    WebMap,
    EsriMap,
    MapView,
    JSON
  ) {

    var webmap = new WebMap({
       portalItem: { // autocasts as new PortalItem()
         id: "d81d00b78ba94daa9a00ef534d9e8602"
       }
     });

    var view = new MapView({
      container: 'viewDiv',
      map: webmap,
      zoom: 2,
        center: [-32, 28],
      ui: {
        components: ['zoom', 'attribution', 'compass']
      }
    });

    // view.when(function() {
    //   // here we use Papa Parse to load and read the CSV data
    //   // we could have also used another library like D3js to do the same
    //   Papa.parse('data/data.csv', {
    //     download: true,
    //     header: true,
    //     dynamicTyping: true,
    //     skipEmptyLines: true,
    //     complete: handleCsvParsingComplete
    //   });
    // });

    view.when(getJson);
      //  .then(handleCsvParsingComplete);


    // function manejarJson(){
    //   data = JSON.parse(data);
    //   console.log(data);
    // }

    function getJson(){

      axios.get('https://cors-anywhere.herokuapp.com/http://geoapps.esri.co/Gismas/rest/dbm/?format=json')
      .then((response) =>{
        console.log("voy a traer el json");
        var data =response.data;
        console.log("data parseado",data);
        handleCsvParsingComplete(data);
      }).catch((err) =>{
        console.log(err);
      });
    }


    function handleCsvParsingComplete(results) {
      console.log("datos a mapear",results);
      var graphicsFromCsvRows = results.map(function(datum) {
        return new Graphic({
          geometry: {
            type: 'point',
            longitude: datum.lon_origen,
            latitude: datum.lat_origen
          },
          attributes: datum
        });
      });
      var canvasFlowmapLayer = new CanvasFlowmapLayer({
        // array of Graphics

        graphics: graphicsFromCsvRows,

        // information about the uniqe origin-destinatino fields and geometries
        originAndDestinationFieldIds: {
          originUniqueIdField: 'direccion_remitente',
          originGeometry: {
            x: 'lon_origen',
            y: 'lat_origen',
            spatialReference: {
              wkid: 4326
            }
          },
          destinationUniqueIdField: 'direccion_destinatario',
          destinationGeometry: {
            x: 'lon_destino',
            y: 'lat_destino',
            spatialReference: {
              wkid: 4326
            }
          }
        }
      });
      console.log(canvasFlowmapLayer);
      view.map.layers.add(canvasFlowmapLayer);

      // get access to the CanvasFlowmapLayer's layerView to make modifications
      // of which O-D relationships are flagged for path display
      view.whenLayerView(canvasFlowmapLayer).then(function(canvasFlowmapLayerView) {
        // automatically select a few ORIGIN locations for path display
        // in order to demonstrate the flowmap functionality,
        // without being overwhelming and showing all O-D relationships

        // Reykjavík
        canvasFlowmapLayerView.selectGraphicsForPathDisplayById('direccion_remitente', "Cl. 90 #13-40, Bogotá", true, 'SELECTION_NEW');

        // Alexandria
        //canvasFlowmapLayerView.selectGraphicsForPathDisplayById('direccion_remitente', 1, true, 'SELECTION_ADD');

        // Tokyo
        //canvasFlowmapLayerView.selectGraphicsForPathDisplayById('direccion_remitente', 642, true, 'SELECTION_ADD');

        // establish a hitTest to try to select new O/D relationships
        // for path display from user interaction;
        // try either 'pointer-move' or 'click' to see the effects
        view.on('pointer-move', function(event) {
        // view.on('click', function(event) {
          var screenPoint = {
            x: event.x,
            y: event.y
          };
          view.hitTest(screenPoint).then(function(response) {
            if (!response.results.length) {
              return;
            }

            // check if the graphic(s) belongs to the layer of interest
            // and mark them as selected for Bezier path display
            response.results.forEach(function(result) {
              if (result.graphic.layer === canvasFlowmapLayer) {
                if (result.graphic.isOrigin) {
                  canvasFlowmapLayerView.selectGraphicsForPathDisplayById(
                    'direccion_remitente',
                    result.graphic.attributes.direccion_remitente,
                    result.graphic.attributes.isOrigin,
                    'SELECTION_NEW'
                  );
                } else {
                  canvasFlowmapLayerView.selectGraphicsForPathDisplayById(
                    'direccion_destinatario',
                    result.graphic.attributes.direccion_destinatario,
                    result.graphic.attributes.isOrigin,
                    'SELECTION_NEW'
                  );
                }
              }
            });
          });
        });
      });
    }
  });
