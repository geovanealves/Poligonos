function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 4
  });

  map.setOptions({ draggableCursor: 'crosshair' });

  markers = [];
  markersDentro = [];
  vertices = [];
  objetoMaior = null;
  segundoObjetoMaior = null;

  var myLatLng = { lat: -25.363, lng: 131.044 };


  for (var i = 0; i < 220; i++) {
    var myLatLng = { lat: (-20.363 + (i * 0.020)), lng: (129.044 + (i * 0.1)) };

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'Hello World!'
    });

    marker.setMap(map);
    markers.push(marker);
  }

  poly = new google.maps.Polyline({
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });

  poly.setMap(map);
  map.addListener('click', addLatLng);

  function addLatLng(event) {

    var path = poly.getPath();
    path.push(event.latLng);

    var marker = new google.maps.Marker({
      position: event.latLng,
      title: '#' + path.getLength(),
      map: map,
      draggable: true
    });

    if (path.getLength() == 3) {

      if (typeof bermudaTriangle != 'undefined') {
        //google.maps.geometry.poly.containsLocation(event.latLng, bermudaTriangle);
        //bermudaTriangle.setMap(null);
      }

      

      for (var i = 0; i < poly.getPath().getLength(); i++) {
        vertices.push(
          new google.maps.LatLng(poly.getPath().getAt(i).lat(), poly.getPath().getAt(i).lng())
        );
      }

      mvc = new google.maps.MVCArray(vertices);
      
        bermudaTriangle = new google.maps.Polygon({
          paths: mvc,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          editable: false
        });
        bermudaTriangle.setMap(map);
        poly.setVisible(false);
      }else if (path.getLength() > 3) {
        cliqueMaisQue4(event);
     }    
    
  }
}

function cliqueMaisQue4(event) {
  var distancia = 0;
  var ultimaCoordenadClicada = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
  var vertice;
    for (var i = 0; i < vertices.length; i++) {
      if(i == vertices.length - 1){
        vertice = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
        distancia = 100000000000000;
      }else{
        vertice = new google.maps.LatLng(vertices[i].lat(), vertices[i].lng());
        distancia = google.maps.geometry.spherical.computeDistanceBetween(vertice, ultimaCoordenadClicada);
        distancia = parseFloat((distancia * 0.001).toFixed(1));
      }
      
      //debugger

      if (distancia != 0) {
        if (objetoMaior == null) {
          objetoMaior = {
            distancia: distancia,
            vertice: vertice,
            indice: i + 1
          }
        } else {
          if (objetoMaior.distancia > distancia) {
            segundoObjetoMaior = objetoMaior;
            objetoMaior = {
              distancia: distancia,
              vertice: vertice,//new google.maps.LatLng(vertices[i].lat(), vertices[i].lng()),
              indice: i + 1
            }
          } else {
            if (segundoObjetoMaior == null) {
              segundoObjetoMaior = {
                distancia: distancia,
                vertice: vertice,//new google.maps.LatLng(vertices[i].lat(), vertices[i].lng()),
                indice: i + 1
              }
            } else if (segundoObjetoMaior.distancia > distancia) {
              segundoObjetoMaior = {
                distancia: distancia,
                vertice: vertice,//new google.maps.LatLng(vertices[i].lat(), vertices[i].lng()),
                indice: i + 1
              }
            }
          }
        }
      }
    }
    
    if (objetoMaior.indice < segundoObjetoMaior.indice) {
      bermudaTriangle.getPath().insertAt(objetoMaior.indice, new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()));//segundoObjetoMaior.vertice);
    } else {
      bermudaTriangle.getPath().insertAt(segundoObjetoMaior.indice, new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()));//objetoMaior.vertice);
    }
}


function verificarMarkers(){
  for (var i = 0; i < markers.length; i++) {
    var estaDentro = google.maps.geometry.poly.containsLocation(markers[i].getPosition(), bermudaTriangle);
    if (estaDentro) {
      markersDentro.push(markers[i]);
    }
  }
}
// function initMap() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 5,
//       center: {lat: 24.886, lng: -70.268},
//       mapTypeId: 'terrain'
//     });

//     var bounds = new google.maps.LatLngBounds();
//     var triangleCoords = [
//       new google.maps.LatLng(25.774252, -80.190262),
//       new google.maps.LatLng(18.466465, -66.118292),
//       new google.maps.LatLng(32.321384, -64.75737)
//     ];

//     mvc = new google.maps.MVCArray(triangleCoords);



//     bermudaTriangle = new google.maps.Polygon({
//       paths: mvc,
//       strokeColor: '#FF0000',
//       strokeOpacity: 0.8,
//       strokeWeight: 2,
//       fillColor: '#FF0000',
//       fillOpacity: 0.35
//     });
//     bermudaTriangle.setMap(map);

//   }



