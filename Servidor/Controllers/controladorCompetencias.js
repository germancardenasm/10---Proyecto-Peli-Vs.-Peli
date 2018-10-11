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
        debugger;
        res.send(JSON.stringify(directores));
    })
}


module.exports ={
    mostrarCompetenciasActuales: mostrarCompetenciasActuales,
    cargarGeneros: cargarGeneros,
    cargarDirectores: cargarDirectores
  }