var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controladorCompetencias = require('./Controllers/controladorCompetencias');

var puerto = 3000;

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.get('/', controladorCompetencias.mostrarCompetenciasActuales);
app.get('/generos', controladorCompetencias.cargarGeneros);
app.get('/directores', controladorCompetencias.cargarDirectores);
app.get('/actores', controladorCompetencias.cargarActores);
app.post('/competencias', controladorCompetencias.crearCompetencia);
app.get('/competencias', controladorCompetencias.consultarCompetencias);
app.get('/competencias/:id/peliculas', controladorCompetencias.obtenerOpciones);
app.listen(puerto, function(){console.log("Escuchando puerto:: " + puerto)});