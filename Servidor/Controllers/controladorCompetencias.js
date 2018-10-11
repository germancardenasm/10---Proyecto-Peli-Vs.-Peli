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
    console.log("Entro a cargarGeneros");
    var sql = "SELECT * FROM genero";

    con.query(sql, function(error, response, fields){
        debugger;
        var generos = JSON.parse(JSON.stringify(response));
        res.send(JSON.stringify(generos));
    })


}


module.exports ={
    mostrarCompetenciasActuales: mostrarCompetenciasActuales,
    cargarGeneros: cargarGeneros
  }