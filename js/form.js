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
    var sugerencias = [];

  for (var i = 0; i < response.data.suggestions.length; i++) {

    var sugerencia = {
      text : response.data.suggestions[i].text,
      value : response.data.suggestions[i].magicKey
    }
    sugerencias.push(sugerencia);
  }
  console.log(sugerencias);
  var opcion = "";

  sugerencias.forEach((option) => {
    opcion += '<option value ="'+ option.text+'">';
     document.getElementById('opciones').innerHTML = opcion;
  }
  );

}

function enviar(){

var origen = document.getElementById("ciudadOrigen").value;
console.log(origen);
console.log(sugerencias);

}
