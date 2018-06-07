function initMap() {
    cache = {};

    cache.vertices = [];

    cache.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });

    cache.poly = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });
    cache.polygon = new google.maps.Polygon({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });

    cache.map.addListener('click', initPoligano);

    cache.poly.setMap(cache.map);

    google.maps.LatLng.prototype.latRadians = function () {
        return (Math.PI * this.lat()) / 180;
    }

    google.maps.LatLng.prototype.lngRadians = function () {
        return (Math.PI * this.lng()) / 180;
    }
}

var initPoligano = function (event) {
    var marker = new google.maps.Marker({
        position: event.latLng,
        title: '#',
        map: cache.map
    });

    if (cache.vertices.length < 2) {
        adicionarPolilinha(event);
    } else if (cache.vertices.length == 2) {
        adicionarTriangulo(event)
    } else {
        adicionarPoliganoMultiplasVertices(event);
    }
}

//-> Adicionar as linhas antes de formar um triangulo 
var adicionarPolilinha = function (event) {
    var path = cache.poly.getPath();
    path.push(event.latLng);
    cache.vertices.push(event.latLng);
}

//-> Adicionando um triangulo
var adicionarTriangulo = function (event) {
    cache.vertices.push(event.latLng);
    cache.polygon.setPath(cache.vertices);
    cache.polygon.setMap(cache.map);
    cache.poly.setMap(null);
}

//-> Adicionando um poligano
var adicionarPoliganoMultiplasVertices = function (event) {
    var indexInserir;
    var primeiroPontoLinha;
    var segundoPontoLinha;
    var indexAnterior;
    var menorDistancia = {};
    var indexComMenorDistancia;
    var indexComMaiorDistancia;
    var verticesDeLigacao;
    //-> Verifica qual é a vertice com a menor distância do ponto clicado no mapa
    for (var i = 0; i < cache.vertices.length; i++) {
        if (i == 0) {
            menorDistancia = {
                distancia: calcularDistancia(event.latLng, cache.vertices[i]),
                indice: i
            }
        } else {
            var distancia = calcularDistancia(event.latLng, cache.vertices[i]);

            if (menorDistancia.distancia > distancia) {
                menorDistancia = {
                    distancia: distancia,
                    indice: i
                }
            }
        }
    }

    verticesDeLigacao = verificar2VerticesDeLigacao(event, menorDistancia);

    primeiroPontoLinha = verticesDeLigacao.primeiroPontoLinha;
    segundoPontoLinha = verticesDeLigacao.segundoPontoLinha;

    indexAnterior = primeiroPontoLinha.indice;

    if (primeiroPontoLinha.distancia < segundoPontoLinha.distancia) {
        indexComMenorDistancia = primeiroPontoLinha.indice;
        indexComMaiorDistancia = segundoPontoLinha.indice;
    } else {
        indexComMenorDistancia = segundoPontoLinha.indice;
        indexComMaiorDistancia = primeiroPontoLinha.indice;
    }

    var angulo = buscarAngulo(cache.vertices[indexComMenorDistancia], event.latLng);

    var latAux = cache.vertices[indexComMenorDistancia].lat() + (0.000001 * Math.cos(Math.PI * angulo / 180));
    var lonAux = cache.vertices[indexComMenorDistancia].lng() + (0.000001 * Math.sin(Math.PI * angulo / 180));

    if (verificarPassaDentroPoligano(cache.polygon, new google.maps.LatLng(latAux, lonAux))) {
        if (indexComMaiorDistancia == indexAnterior) {
            indexInserir = indexComMaiorDistancia + 1;
        } else {
            indexInserir = indexComMaiorDistancia;
        }
    } else {
        if (indexComMenorDistancia == indexAnterior) {
            indexInserir = indexComMenorDistancia + 1;
        } else {
            indexInserir = indexComMenorDistancia;
        }
    }

    var path = cache.polygon.getPath();
    path.insertAt(indexInserir, event.latLng);

    cache.vertices.splice(indexInserir, 0, event.latLng);
}

//-> Verifica as 2 vertices que faz ligação com a vertice mais próxima do ponto clicado
var verificar2VerticesDeLigacao = function (event, menorDistancia) {
    var resultado = {};

    if (menorDistancia.indice == 0) {
        primeiroPontoLinha = {
            distancia: calcularDistancia(event.latLng, cache.vertices[cache.vertices.length - 1]),
            indice: cache.vertices.length - 1
        }
        segundoPontoLinha = {
            distancia: calcularDistancia(event.latLng, cache.vertices[menorDistancia.indice + 1]),
            indice: menorDistancia.indice + 1
        }
    } else if (menorDistancia.indice == cache.vertices.length - 1) {
        primeiroPontoLinha = {
            distancia: calcularDistancia(event.latLng, cache.vertices[menorDistancia.indice - 1]),
            indice: menorDistancia.indice - 1
        }
        segundoPontoLinha = {
            distancia: calcularDistancia(event.latLng, cache.vertices[0]),
            indice: 0
        }
    } else {
        primeiroPontoLinha = {
            distancia: calcularDistancia(event.latLng, cache.vertices[menorDistancia.indice - 1]),
            indice: menorDistancia.indice - 1
        }
        segundoPontoLinha = {
            distancia: calcularDistancia(event.latLng, cache.vertices[menorDistancia.indice + 1]),
            indice: menorDistancia.indice + 1
        }
    }

    resultado = {
        primeiroPontoLinha: primeiroPontoLinha,
        segundoPontoLinha: segundoPontoLinha
    }

    return resultado;
}

//-> Calcula a distância de uma coordenada da outra
var calcularDistancia = function (p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = ((p2.lat() - p1.lat()) * Math.PI / 180);
    var dLong = ((p2.lng() - p1.lng()) * Math.PI / 180);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((p1.lat() * Math.PI / 180)) * Math.cos((p2.lat() * Math.PI / 180)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

//-> Busca o angulo em relação ao poligano.
var buscarAngulo = function (from, to) {
    // See T. Vincenty, Survey Review, 23, No 176, p 88-93,1975.
    // Convert to radians.
    var lat1 = from.latRadians();
    var lon1 = from.lngRadians();
    var lat2 = to.latRadians();
    var lon2 = to.lngRadians();

    // Compute the angle.
    var angle = - Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0.0){
        angle += Math.PI * 2.0;
    }

    var degreesPerRadian = 180.0 / Math.PI;

    // And convert result to degrees.
    angle = angle * degreesPerRadian;
    angle = angle.toFixed(1);

    return angle;
}

//-> Responsável por verificar se aquele ponto vai quebrar o poligano
var verificarPassaDentroPoligano = function (polygon, latLng) {
    var lat = latLng.lat();
    var lng = latLng.lng();
    var paths = polygon.getPaths();
    var path, pathLength, inPath, i, j, vertex1, vertex2;
    for (var p = 0; p < paths.getLength(); p++) {

        path = paths.getAt(p);
        pathLength = path.getLength();
        j = pathLength - 1;
        inPath = false;
        for (i = 0; i < pathLength; i++) {
            
            vertex1 = path.getAt(i);
            vertex2 = path.getAt(j);
            
            if (vertex1.lng() < lng && vertex2.lng() >= lng || vertex2.lng() < lng && vertex1.lng() >= lng) {
                if (vertex1.lat() + (lng - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < lat) {
                    inPath = !inPath;
                }
            }
            
            j = i;
        }

        if (inPath) {
            return true;
        }
    }

    return false;
}