function myFunction() {
    var ciudadOrigen = document.getElementById("ciudadOrigen").value;
    console.log(ciudadOrigen);

      axios.get('http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest', {params:{
        text: ciudadOrigen,
        f: "pjson"
      }})
      .then(guardar).catch((err)=>{
        console.log(err);
      });
}

function guardar(response){
  console.log(response);
    var sugerencias = [];
    var idmagic = [];

  for (var i = 0; i < response.data.suggestions.length; i++) {
    var sugerencia = response.data.suggestions[i].text;
    var idm = response.data.suggestions[i].text;
    sugerencias.push(sugerencia);
    idmagic.push(idm);
  }  console.log(sugerencias);
  sugerencias = [];


}
