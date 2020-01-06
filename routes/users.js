var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
var middlewareAutenticar = require("../middleware/autenticar");
const { user: userDB, password: passwordDB, url: urlDB}  = require('../dataBase/mysql.json')
const consMysql = `mysql://${userDB}:${passwordDB}@${urlDB}/XimuDB`
var router = express.Router(); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);

router.get('/', async function(req,res){
    let id =[req.userId];
    const connection = mysql.createConnection(consMysql);
	await connection.query("SELECT * FROM Users WHERE id = ?", id, async function(error, results){
		if (error) {
			return res.status(404).end();
		}	
        let resposta = results[0];
		return res.status(200).send(resposta);
	});
});

router.put('/', async function(req,res){
    let user =[];
    user[0] = req.body.user.name;
    user[1] = req.body.user.telegram;
    user[2] = req.userId;
    const connection = mysql.createConnection(consMysql);
	await connection.query("UPDATE Users SET name=? WHERE id = ?", user, async function(error, results){
		if (error) {
			return res.status(404).end();
		}	
		return res.status(200).end();
	});
})

router.delete('/', async function(req,res){
    let id = [req.userId];
    console.log(id);
    const connection = mysql.createConnection(consMysql);
	await connection.query("DELETE FROM Users WHERE id = ?", id, async function(error, results){
		if (error) {
            console.log(error)
			return res.status(404).end();
		}	
		return res.status(200).end();
	});
})

module.exports = router;
