function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });

    
    var myLatLng = {lat: -25.363, lng: 131.044};
    
     
      var marker1 = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!',
        id: 'AAA'
      });

      var myLatLng2 = {lat: -20.363, lng: 129.044};
      
       
        var marker2 = new google.maps.Marker({
          position: myLatLng2,
          map: map,
          title: 'Hello World!',
          id: 'AAA'
        });
        markers = [];
        markersDentro = [];
        markers.push(marker1);
        markers.push(marker2);

    poly = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        geodesic: true
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

        if (path.getLength() >= 3) {
            
            if(typeof bermudaTriangle != 'undefined'){
                google.maps.geometry.poly.containsLocation(event.latLng, bermudaTriangle);
                bermudaTriangle.setMap(null);
            }
                          
            var lados = [];

            for (var i = 0; i < poly.getPath().getLength(); i++) {
                lados.push({ 
                    lat: poly.getPath().getAt(i).lat(), 
                    lng: poly.getPath().getAt(i).lng()
                });
            }

            bermudaTriangle = new google.maps.Polygon({
                paths: lados,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                editable: true
            });
            bermudaTriangle.setMap(map);
            
            for (var i = 0; i < markers.length; i++) {
                var estaDentro = google.maps.geometry.poly.containsLocation(markers[i].getPosition(), bermudaTriangle);
                if(estaDentro){
                    markersDentro.push(markers[i]);
                }
            }

        }
    }
}

