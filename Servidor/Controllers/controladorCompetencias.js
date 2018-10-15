var con = require('../Lib/Connection.js');


function mostrarCompetenciasActuales(req, res, fields){
   
    var sql = "SELECT count(*) AS total FROM competencias_peliculas";
    
    con.query(sql, function(error, response, fields){
        var total = response[0].total;
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

function cargarCompetencia(req, res, fields){

    var idCompetencia = req.params.id;
    var sql = "SELECT competencias.nombre as nombre, actor.nombre as actor_nombre, genero.nombre as genero_nombre, director.nombre as director_nombre  FROM competencias JOIN actor ON competencias.id = " + idCompetencia + " AND competencias.actor = actor.id LEFT JOIN genero ON competencias.genero = genero.id LEFT JOIN director ON competencias.director=director.id;" 
    
    con.query(sql, function(error, response, fields){
        res.send(JSON.stringify(response[0]));
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

function obtenerResultados(req, res, fields){

    var idCompetencia = req.params.id;
    var sql = "SELECT  nombre, peli_id, titulo, poster, votos FROM competencias_peliculas JOIN competencias ON competencia_id = competencias.id AND competencias.id = " + idCompetencia +  " JOIN pelicula ON peli_id = pelicula.id ORDER BY votos DESC;";
    
    con.query(sql, function(error, response, fields){
        var competencia = response[0].nombre;
        var data = {
            competencia: competencia,
            resultados: response
        }
        res.send(JSON.stringify(data));
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
            for(var i= 0; i< peliculas.length ; i++){
                var sqlPost = "INSERT INTO competencias_peliculas (competencia_id, peli_id , votos) VALUES (" + response.insertId + "," + peliculas[i].id +"," + 0 + ");"; 
                con.query(sqlPost, function(error, response, fields){
                    if(error) return console.log("error al crear la competencia");
                })
            }   
            res.status(200).send("Ok");
        })
    })
}


function contarVoto(req, res, fields){

    var idPelicula = req.body.idPelicula;
    var idCompetencia = req.params.id;
    var sql = "UPDATE competencias_peliculas SET votos = votos + 1 WHERE competencia_id = " + idCompetencia + " AND peli_id = " + idPelicula + ";" ;
    
    con.query(sql, function(error, response, fields){
        if(error) return console.log("Fallo la suma de votos: " + error);
        res.status(200).send(JSON.stringify("Success"));
    }) 
}

function actualizarCompetencia(req, res, fields){
    
    var idCompetencia = req.params.id;
    var sql = "UPDATE competencias SET nombre = \"" + req.body.nombre + "\" WHERE id= " + idCompetencia + ";" ;

    con.query(sql, function(error, response, fields){
        if(error) return console.log("Fallo actualizando el nombre " + error);
        res.status(200).send(JSON.stringify("Success"));
    }) 
}

function borrarCompetencia(req, res, fields){
    
    var idCompetencia = req.params.id;
    var sql = "DELETE FROM competencias_peliculas WHERE competencia_id = ?;"

    con.query(sql, [idCompetencia], function(error, response, fields){
        if(error) return console.log("Fallo borrando registros de votacion");
        var sqlBorrar = "DELETE FROM competencias WHERE id = ?;"
        con.query(sqlBorrar, [idCompetencia], function(error, response, fields){
            if(error) return console.log("Fallo borrando registro de COmpetencia " + error);
            res.status(200).send(JSON.stringify("Success"));
        }) 
    }) 
}


function reiniciarCompetencia(req, res, fields){
    
    var idCompetencia = req.params.id;
    var sql = "UPDATE competencias_peliculas SET votos = 0 WHERE competencia_id = ?;"

    con.query(sql, [idCompetencia], function(error, response, fields){
        if(error) return console.log("Fallo reiniciando registros de votacion");
        res.status(200).send(JSON.stringify("Success"));

    }) 
}


module.exports ={
    mostrarCompetenciasActuales: mostrarCompetenciasActuales,
    cargarGeneros: cargarGeneros,
    cargarDirectores: cargarDirectores,
    cargarActores: cargarActores,
    crearCompetencia: crearCompetencia,
    cargarCompetencia: cargarCompetencia,
    consultarCompetencias: consultarCompetencias,
    obtenerOpciones: obtenerOpciones,
    contarVoto: contarVoto,
    obtenerResultados: obtenerResultados,
    actualizarCompetencia: actualizarCompetencia,
    borrarCompetencia: borrarCompetencia,
    reiniciarCompetencia: reiniciarCompetencia
  }