function capturaOrigen() {
    var ciudadOrigen = document.getElementById("ciudadOrigen").value;
      axios.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest', {params:{
        text: ciudadOrigen,
        f: "pjson"
      }})
      .then(guardarOrigen).catch((err)=>{
        console.log(err);
      });
}
function capturaDestino() {
    var ciudadDestino= document.getElementById("ciudadDestino").value;
      axios.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest', {params:{
        text: ciudadDestino,
        f: "pjson"
      }})
      .then(guardarDestino).catch((err)=>{
        console.log(err);
      });
}

function guardarOrigen(responseOrigen){
  var sugerenciasOrigen = [];

  for (var i = 0; i < responseOrigen.data.suggestions.length; i++) {

    var sugerenciaOrigen = {
      text : responseOrigen.data.suggestions[i].text,
      value : responseOrigen.data.suggestions[i].magicKey
    }
    sugerenciasOrigen.push(sugerenciaOrigen);
  }
  var opcionOrigen = "";

  sugerenciasOrigen.forEach((option) => {
    opcionOrigen += '<option value ="'+ option.text+'">';
     document.getElementById('opciones').innerHTML = opcionOrigen;
  }
  );
}


function guardarDestino(responseDestino){
  var sugerenciasDestino = [];
for (var i = 0; i < responseDestino.data.suggestions.length; i++) {

    var sugerenciaDestino = {
      text : responseDestino.data.suggestions[i].text,
      value : responseDestino.data.suggestions[i].magicKey
    }
    sugerenciasDestino.push(sugerenciaDestino);
  }
var opcionDestino = "";

  sugerenciasDestino.forEach((option) => {
    opcionDestino += '<option value ="'+ option.text+'">';
     document.getElementById('opcionesDestino').innerHTML = opcionDestino;
  });
}


function procesar(){
  var origen = document.getElementById("ciudadOrigen").value;
  var destino = document.getElementById("ciudadDestino").value;
    axios.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates', {params:{
      f: "json",
      singleLine: origen,
      outFields: "Match_addr,Addr_type"
    }})
    .then(enviarOrigen).catch((err)=>{
      console.log(err);
    });

    axios.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates', {params:{
    f: "json",
    singleLine: destino,
    outFields: "Match_addr,Addr_type"
    }})
    .then(enviarDestino).catch((err)=>{
    console.log(err);
    });
}
var xOrigen;
var yOrigen;
function enviarOrigen(respuestaOrigen){

  xOrigen = respuestaOrigen.data.candidates[0].location.x;
  yOrigen = respuestaOrigen.data.candidates[0].location.y;

}
var xDestino;
var yDestino;
function enviarDestino(respuestaDestino){

    xDestino = respuestaDestino.data.candidates[0].location.x;
    yDestino = respuestaDestino.data.candidates[0].location.y;
dataForm();

}
function dataForm(){

  var nombre_remitente = document.getElementById("nombre_remitente").value;
  var correo_remitente = "semillero@esri.co";
  var direccion_remitente = document.getElementById("ciudadOrigen").value;
  var nombre_destinatario = document.getElementById("nombre_destinatario").value;
  var correo_destinatario = document.getElementById("correo_destinatario").value;
  var direccion_destinatario = document.getElementById("ciudadDestino").value;
  var mensaje = document.getElementById("mensaje").value;
  var lat_origen = yOrigen;
  var lon_origen = xOrigen;
  var lat_destino = yDestino;
  var lon_destino = xDestino;

  var headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  var info = {
    nombre_remitente: nombre_remitente,
    correo_remitente : correo_remitente ,
    direccion_remitente: direccion_remitente,
    nombre_destinatario: nombre_destinatario,
    correo_destinatario : correo_destinatario,
    direccion_destinatario: direccion_destinatario,
    mensaje: mensaje,
    lat_origen: lat_origen,
    lon_origen: lon_origen,
    lat_destino: lat_destino,
    lon_destino: lon_destino
  };
   var data = JSON.stringify(info);
  axios.post('https://cors-anywhere.herokuapp.com/http://geoapps.esri.co/Gismas/rest/dbm/', data, {headers: headers}) .then(function(response) {
    console.log("Enviado");
  }).catch(function(error) {
    console.log(error);
  })
  }
