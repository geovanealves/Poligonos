function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 4
    });

    map.setOptions({ draggableCursor: 'crosshair' });

    markers = [];
    markersDentro = [];
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
            map: map
        });

        if (path.getLength() >= 2) {

            if (typeof bermudaTriangle != 'undefined') {
                google.maps.geometry.poly.containsLocation(event.latLng, bermudaTriangle);
                bermudaTriangle.setMap(null);
                poly.setVisible(false);
            }

            var lados = [];


            for (var i = 0; i < poly.getPath().getLength(); i++) {
                lados.push({
                    lat: poly.getPath().getAt(i).lat(),
                    lng: poly.getPath().getAt(i).lng()
                });
            }

            var distancia = 0;
            var ultimaCorrdenadClicada = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
            var objetoMaior = {};
            var segundoObjetoMaior = {};

            for (var i = 0; i < lados.length; i++) {
                var lado = new google.maps.LatLng(lados[i].lat, lados[i].lng);
                distancia = google.maps.geometry.spherical.computeDistanceBetween(lado, ultimaCorrdenadClicada);
                distancia = parseFloat((distancia * 0.001).toFixed(1));
                
                if(i == 0){
                    objetoMenor = {
                        distancia: distancia,
                        posicao: lado 
                    }
                }else if(i == 1){
                    segundoObjetoMenor = {
                        distancia: distancia,
                        posicao: lado 
                    }
                }else{
                    if(distancia < segundoObjetoMenor.distancia){
                        var lenghtUltimoLado = (lados.length - 1);
                        var aux = lados[lenghtUltimoLado];

                        lados[lenghtUltimoLado] = lados[i];
                        //lados[i] = aux;

                        segundoObjetoMenor = {
                            distancia: distancia,
                            posicao: lados[lenghtUltimoLado] 
                        }

                    }else if(distancia < objetoMenor.distancia){

                        var lenghtUltimoLado = (0);
                        var aux = lados[lenghtUltimoLado];

                        lados[lenghtUltimoLado] = lados[i];
                        //lados[i] = aux;

                        objetoMenor = {
                            distancia: distancia,
                            posicao: lados[lenghtUltimoLado]  
                        }
                    }

                }
            }

            bermudaTriangle = new google.maps.Polygon({
                paths: lados,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                editable: false
            });

            bermudaTriangle.setMap(map);

            for (var i = 0; i < markers.length; i++) {
                var estaDentro = google.maps.geometry.poly.containsLocation(markers[i].getPosition(), bermudaTriangle);
                if (estaDentro) {
                    markersDentro.push(markers[i]);
                }
            }
        }
    }
}