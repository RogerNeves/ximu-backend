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

router.get('/', async function (req, res) {
  let sql;
  if (req.query.id) {
    sql = "SELECT * FROM Models WHERE id = " + req.query.id;
  } else {
    sql = "SELECT * FROM Models WHERE idUser = " + req.userId;
  }

  const connection = mysql.createConnection(consMysql);
  await connection.query(sql, async function (error, results) {
    if (error) {
      return res.status(304).end();
    }
    let response = results;
    if (req.query.id) {
      response = results[0];
    }
    return res.status(200).send(response);
  });
});

router.post('/', async function (req, res) {
  let model = [];
  model.push(req.body.model.name);
  model.push(req.userId);
  const connection = mysql.createConnection(consMysql);
  await connection.query("INSERT INTO Models(name, idUser) VALUES (?,?)", model, async function (error, results) {
    if (error) {
      return res.status(304).end();
    }
    const datas = req.body.datas.map(data => [data.name, results.insertId, parseInt(data.idDataType)])
    console.log(datas);
    const values = datas.map(() => "(?)")
    await connection.query("INSERT INTO ModelsData(name, IdModel, idDataType) VALUES " + values.join(","), datas, async function (error, results) {
      if (error) {
        console.log(error)
        return res.status(304).end();
      }
      let response = results;

      return res.status(200).send(response);
    });

  });
})

router.put('/', async function (req, res) {
  let model = [];
  model.push(req.body.model.name);
  model.push(req.body.model.Id);
  const connection = mysql.createConnection(consMysql);
  await connection.query("UPDATE Models SET name=? WHERE id = ?", model, async function (error, results) {
    if (error) {
      return res.status(304).end();
    }
    return res.status(200).end();
  });
})

router.delete('/:id', async function (req, res) {
  let id = [req.params.id];
  console.log(id);
  const connection = mysql.createConnection(consMysql);
  await connection.query("DELETE FROM Models WHERE id = ?", id, async function (error, results) {
    if (error) {
      console.log(error)
      return res.status(404).end();
    }
    return res.status(200).end();
  });
})

module.exports = router;
