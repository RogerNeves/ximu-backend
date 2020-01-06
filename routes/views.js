const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require("body-parser");
const middlewareAutenticar = require("../middleware/autenticar");
const { user: userDB, password: passwordDB, url: urlDB}  = require('../dataBase/mysql.json')
const consMysql = `mysql://${userDB}:${passwordDB}@${urlDB}/XimuDB`
const router = express.Router();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);

router.get('/', async function(req,res){
	let sql = ''
	if(req.query.idDashboard)
		sql = "SELECT * FROM Views WHERE idDashboards = " + req.query.idDashboard
console.log(sql)
    const connection = mysql.createConnection(consMysql);
	await connection.query(sql, async function(error, results){
		if (error) {
            console.log(error);
            
			return res.status(304).end();
		}	
        let resposta = results;
		return res.status(200).send(resposta);
	});
});

router.post('/', async function(req,res) {
	const gauge =[];
	gauge.push( req.body.gauge.nome );
	gauge.push( req.body.gauge.idDashboard );
    gauge.push( req.body.gauge.idDadosEntrada );
	gauge.push( req.body.gauge.criacao );
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO Gauges(nome, idDashboard, idDadosEntrada, criacao) VALUES (?,?,?,?)", gauge, async function(error, results){
		if (error) {
			return res.status(404).end();
		}	
        let resposta = results[0];
		return res.status(200).send(resposta);
	});
})


router.delete('/:id', async function(req,res){
    let id = [req.params.id];
    console.log(id);
    const connection = mysql.createConnection(consMysql);
	await connection.query("DELETE FROM gauge WHERE id = ?", id, async function(error, results){
		if (error) {
            console.log(error)
			return res.status(404).end();
		}	
		return res.status(200).end();
	});
})

module.exports = router;
