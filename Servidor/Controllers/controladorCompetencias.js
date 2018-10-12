var con = require('../Lib/Connection.js');


function mostrarCompetenciasActuales(req, res, fields){
    console.log("Entro a mostrarCompetenciasActuales");
    var sql = "SELECT count(*) AS total FROM competencias_peliculas";

    con.query(sql, function(error, response, fields){
        var total = response[0].total;
        console.log(total);
        res.send("El numero de competencias en la base es ::" + total);
    })


}       

function cargarGeneros(req, res, fields){
    var sql = "SELECT * FROM genero";
    con.query(sql, function(error, response, fields){
        var generos = JSON.parse(JSON.stringify(response));
        res.send(JSON.stringify(generos));
    })
}

function cargarDirectores(req, res, fields){
    var sql = "SELECT * FROM director";
    con.query(sql, function(error, response, fields){
        var directores = JSON.parse(JSON.stringify(response));
        res.send(JSON.stringify(directores));
    })
}

function cargarActores(req, res, fields){
    var sql = "SELECT * FROM actor";
    con.query(sql, function(error, response, fields){
        var actor = JSON.parse(JSON.stringify(response));
        res.send(JSON.stringify(actor));
    })
}

function consultarCompetencias(req, res, fields){
    var sql = "SELECT * FROM competencias";
    con.query(sql, function(error, response, fields){
        var competencias = JSON.parse(JSON.stringify(response));
        res.send(JSON.stringify(competencias));
    })
}

function obtenerOpciones(req, res, fields){
    var id = req.params.id;
    var sql = "SELECT * FROM competencias where id = " +id;
    con.query(sql, function(error, response, fields){
        var competencia = response[0].nombre;
        var actor = response[0].actor;
        var genero = response[0].genero;
        var director = response[0].director;
        var sqlInfoPelicula = "select pelicula.id,titulo, poster from pelicula join competencias_peliculas on pelicula.id=peli_id AND competencia_id = " + id + ";";
        con.query(sqlInfoPelicula, function(error, response, fields){
        
            var opciones = {
                competencia: competencia,
                actor:  actor,
                genero: genero,
                director: director,
                peliculas: response 
            }

            res.send(JSON.stringify(opciones));
        })
        
    })
}


function crearCompetencia(req, res, fields){
    var nombre = res.req.body.nombre
    var genero = res.req.body.genero
    var director = res.req.body.director
    var actor = res.req.body.actor
    var sql = "SELECT pelicula.id FROM pelicula JOIN actor_pelicula ON actor_id = " + actor + " AND pelicula_id=pelicula.id; ";

    con.query(sql, function(error, response, fields){
        var peliculas = JSON.parse(JSON.stringify(response));
        var sqlCrearCompetencia = "INSERT INTO competencias (nombre, genero, director, actor) VALUES (" + "\""+ nombre + "\"" + ", " + "\"" +genero +  "\"" + ", " + "\""  + director +  "\"" + ", " + "\"" + actor +  "\"" + ");" 
        con.query(sqlCrearCompetencia, function(error, response, fields){
                if(error) return console.log("Fallo la creacion: " + error);
                
                for(var i= 0; i< peliculas.length ; i++)
                {
                    var sqlPost = "INSERT INTO competencias_peliculas (competencia_id, peli_id , votacion) VALUES (" + response.insertId + "," + peliculas[i].id +"," + 0 + ");"; 
                    con.query(sqlPost, function(error, response, fields){
                        if(error) return console.log("error al crear la competencia");
                        console.log("Se añadio la pelicula" + i);
                    })
                }
                
        })
    })
    
}

module.exports ={
    mostrarCompetenciasActuales: mostrarCompetenciasActuales,
    cargarGeneros: cargarGeneros,
    cargarDirectores: cargarDirectores,
    cargarActores: cargarActores,
    crearCompetencia: crearCompetencia,
    consultarCompetencias: consultarCompetencias,
    obtenerOpciones: obtenerOpciones
  }