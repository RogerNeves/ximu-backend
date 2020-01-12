const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require("body-parser");
const middlewareAutenticar = require("../middleware/autenticar");
const { user: userDB, password: passwordDB, url: urlDB, database} = require('../dataBase/mysql.json')
const consMysql = `mysql://${userDB}:${passwordDB}@${urlDB}/${database}`
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);

router.get('/', function (req, res, next) {
    let sql;
    if (req.query.id) {
        sql = "SELECT * FROM DataTypes WHERE id= " + req.query.id;
    } else {
        sql = "SELECT * FROM DataTypes";
    }
    const connection = mysql.createConnection(consMysql);
    connection.query(sql, function (error, results) {
        if (error) {
            console.log(error)
            return res.status(404).end();
        }
        let resposta = results;
        if (req.query.id) {
            resposta = results[0];
        }
        return res.status(200).send(resposta);
    });
});

module.exports = router;
