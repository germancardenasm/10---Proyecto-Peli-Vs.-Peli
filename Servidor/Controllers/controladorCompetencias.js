var con = require('../Lib/Connection.js');
  

function cargarGeneros(req, res, fields){
    
    var sqlListadoPeliculas = "SELECT * FROM genero";
    
    con.query(sqlListadoPeliculas, function(error, response, fields){
        var generos = JSON.parse(JSON.stringify(response));
        res.send(JSON.stringify(generos));
    })
}

function cargarDirectores(req, res, fields){
    
    var sqlListadoPeliculas = "SELECT * FROM director";
    
    con.query(sqlListadoPeliculas, function(error, response, fields){
        var directores = JSON.parse(JSON.stringify(response));
        res.send(JSON.stringify(directores));
    })
}

function cargarActores(req, res, fields){

    var sqlListadoPeliculas = "SELECT * FROM actor";
   
    con.query(sqlListadoPeliculas, function(error, response, fields){
        var actor = JSON.parse(JSON.stringify(response));
        res.send(JSON.stringify(actor));
    })
}

function mostrarCompetenciasActuales(req, res, fields){
   
    var sqlListadoPeliculas = "SELECT count(*) AS total FROM competencias_peliculas";
    
    con.query(sqlListadoPeliculas, function(error, response, fields){
        var total = response[0].total;
        res.send("El numero de competencias en la base es ::" + total);
    })
}     

function consultarCompetencias(req, res, fields){

    var sqlListadoPeliculas = "SELECT * FROM competencias";
    
    con.query(sqlListadoPeliculas, function(error, response, fields){
        var competencias = JSON.parse(JSON.stringify(response));
        res.send(JSON.stringify(competencias));
    })
}

function cargarCompetencia(req, res, fields){

    var idCompetencia = req.params.id;
    var actor = "";
    var director = "";
    var genero = "";
    //var sqlInfoCompetenciaSeleccionada = "SELECT competencias.nombre as nombre, competencias.actor as actor_id, competencias.genero as genero_id, competencias.director as director_id  FROM competencias WHERE competencias.id = " + idCompetencia + ";" 

    var sqlInfoCompetenciaSeleccionada  = 
    "SELECT nombre, actor_nombre, genero_nombre, director_nombre from "+
    "(SELECT competencias.id as id, competencias.nombre as nombre, actor.nombre as actor_nombre, genero.nombre as genero_nombre, director.nombre as director_nombre FROM competencias" +
    " LEFT JOIN actor ON competencias.id = ? AND competencias.actor = actor.id LEFT JOIN director ON competencias.id = ? AND competencias.director = director.id" + 
    " LEFT JOIN genero ON competencias.id = ? AND competencias.genero=genero.id) as T where id = ?;"
    
    con.query(sqlInfoCompetenciaSeleccionada, [idCompetencia,idCompetencia,idCompetencia,idCompetencia], function(error, response, fields){
        if(error) return console.log("Fallo obteniendo la informcion de la competencia: " + error);
        
        res.send(JSON.stringify(response[0]));

    })  
    
    /*     
    con.query(sqlInfoCompetenciaSeleccionada, function(error, response, fields){
        if(error) return console.log("Fallo obteniendo la informcion de la competencia: " + error);
        var nombre = response[0].nombre;
        var actor_id = response[0].actor_id;
        var director_id = response[0].director_id;
        var genero_id = response[0].genero_id;

        con.query("SELECT nombre FROM actor where id = " + actor_id + ";", function(error, response, fields){
            if(response.length>0) actor = response[0].nombre;

            con.query("SELECT nombre FROM director where id = " + director_id + ";", function(error, response, fields){
                if(response.length>0) director = response[0].nombre;

                con.query("SELECT nombre FROM genero where id = " + genero_id + ";", function(error, response, fields){
                    if(response.length>0) genero = response[0].nombre;
                    
                    res.send(JSON.stringify({nombre: nombre ,actor_nombre: actor ,genero_nombre: genero, director_nombre:director}));

                })  
            })
        }) 
         

    })*/
}

function obtenerOpciones(req, res, fields){

    var competenciaId = req.params.id;
    var sqlListadoPeliculas = "SELECT * FROM competencias where id = ?"

    con.query(sqlListadoPeliculas, [competenciaId], function(error, response, fields){
        if(!response.length) return res.status(404).send("Error, no existe esta competencia!");
        var competencia = response[0].nombre;
        var actor = response[0].actor;
        var genero = response[0].genero;
        var director = response[0].director;
        var sqlInfoPelicula = "select pelicula.id,titulo, poster from pelicula join competencias_peliculas on pelicula.id=peli_id AND competencia_id = ? order by RAND() LIMIT 0,2;";
        con.query(sqlInfoPelicula, [competenciaId], function(error, response, fields){
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
    var sqlListadoPeliculas = "SELECT  nombre, peli_id, titulo, poster, votos FROM competencias_peliculas JOIN competencias ON competencia_id = competencias.id AND competencias.id = ? JOIN pelicula ON peli_id = pelicula.id ORDER BY votos DESC;";
    
    con.query(sqlListadoPeliculas, [idCompetencia], function(error, response, fields){
        var competencia = response[0].nombre;
        var data = {
            competencia: competencia,
            resultados: response
        }
        res.send(JSON.stringify(data));
    })
}

function crearCompetencia(req, res, fields){

    if(!res.req.body.nombre) return res.status(422).send("Error, requiere establecer un nombre para la competencia!");
    var datosDeLaCompetencia = [res.req.body.nombre,res.req.body.genero,res.req.body.director,res.req.body.actor];
    var sqlFiltrosSeleccionados = crearConsultaSqlFiltrosSeleccionados(res);

    con.query(sqlFiltrosSeleccionados, 0, function(error, response, fields){     
        if(error) return res.send(error);
        if(response.length<3)  return res.status(422).send("No se tienen suficientes peliculas con estos criterios para realizar una competencia");

        var sqlCrearCompetencia = "INSERT INTO competencias (nombre, genero, director, actor) VALUES (?, ?, ?, ?);" 
   
     
        con.query(sqlCrearCompetencia, datosDeLaCompetencia, function(error, response, fields){
            
            if(error) return res.send(error);
            
            var idCompetencia = response.insertId
            var sqlPost = "INSERT INTO competencias_peliculas (competencia_id, peli_id, votos)" + sqlFiltrosSeleccionados
            con.query(sqlPost, [idCompetencia], function(error, response, fields){
                    if(error) return console.log("error al crear la competencia");
                    res.send(response);
            })
        })  
    })  
}

function crearConsultaSqlFiltrosSeleccionados(res){

    var sqlListadoPeliculas = " SELECT ?, pelicula.id, 0 FROM pelicula " 
    
    if(res.req.body.actor>0)
        sqlListadoPeliculas += " JOIN actor_pelicula ON actor_pelicula.actor_id = " + res.req.body.actor + " AND pelicula.id = actor_pelicula.pelicula_id"
    if(res.req.body.director>0)
        sqlListadoPeliculas += " JOIN director ON director.id =  " + res.req.body.director +  " AND pelicula.director = director.nombre"
    if(res.req.body.genero>0)
        sqlListadoPeliculas += " where pelicula.genero_id = " + res.req.body.genero 
    if(res.req.body.director==0 && res.req.body.genero==0 && res.req.body.actor==0 )
        sqlListadoPeliculas = "SELECT pelicula.id FROM pelicula" 
    
    sqlListadoPeliculas += " order by RAND();"
    return sqlListadoPeliculas;
}

function contarVoto(req, res, fields){

    var idPelicula = req.body.idPelicula;
    var idCompetencia = req.params.id;
    var sqlListadoPeliculas = "UPDATE competencias_peliculas SET votos = votos + 1 WHERE competencia_id = ? AND peli_id = ?;" ;
    
    con.query(sqlListadoPeliculas, [idCompetencia, idPelicula], function(error, response, fields){
        if(error) return console.log("Fallo la suma de votos: " + error);
        res.send(JSON.stringify(response));
    }) 
}

function editarCompetencia(req, res, fields){
    
    var idCompetencia = req.params.id;
    var sqlListadoPeliculas = "UPDATE competencias SET nombre = ? WHERE id= ? ;" ;

    con.query(sqlListadoPeliculas, [req.body.nombre, idCompetencia], function(error, response, fields){
        if(error) return console.log("Fallo actualizando el nombre " + error);
        res.send(JSON.stringify(response));
    }) 
}

function borrarCompetencia(req, res, fields){
    
    var idCompetencia = req.params.id;
    var sqlListadoPeliculas = "DELETE FROM competencias_peliculas WHERE competencia_id = ?;"

    con.query(sqlListadoPeliculas, [idCompetencia], function(error, response, fields){
        if(error) return console.log("Fallo borrando registros de votacion");
        var sqlBorrar = "DELETE FROM competencias WHERE id = ?;"
        con.query(sqlBorrar, [idCompetencia], function(error, response, fields){
            if(error) return console.log("Fallo borrando registro de COmpetencia " + error);
            res.send(JSON.stringify(response));
        }) 
    }) 
}

function reiniciarCompetencia(req, res, fields){
    
    var idCompetencia = req.params.id;
    var sqlListadoPeliculas = "UPDATE competencias_peliculas SET votos = 0 WHERE competencia_id = ?;"

    con.query(sqlListadoPeliculas, [idCompetencia], function(error, response, fields){
        if(error) return console.log("Fallo reiniciando registros de votacion");
        res.send(JSON.stringify(response));
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
    editarCompetencia: editarCompetencia,
    borrarCompetencia: borrarCompetencia,
    reiniciarCompetencia: reiniciarCompetencia
  }