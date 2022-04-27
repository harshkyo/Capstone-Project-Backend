const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 8080;

const db_connection = require("./config/db").promise();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/services", async (req, res) => {
  try {
    const [rows] = await db_connection.execute(
      "SELECT distinct `service` FROM `records`"
    );
    return res.json({ success: true, listall: rows, });
  } catch (err) {
    console.log(err);
  }
});

app.get("/fourRandomServices", async (req, res) => {
  try {
    const [rows] = await db_connection.execute(
      "SELECT DISTINCT `service` FROM `records` ORDER BY rand() limit 4"
    );
    return res.json({ success: true, listall: rows, });
  } catch (err) {
    console.log(err);
  }
});

app.get("/subServices", async (req, res) => {
  try {
    const [rows] = await db_connection.execute(
      "SELECT `id`, `subservice` FROM `records` where `service` = ?",
      [req.query["service"][0]]
    );
    return res.json({ success: true, listall: rows, });
  } catch (err) {
    console.log(err);
  }
});

app.get("/information", async (req, res) => {
  try {
    const [rows] = await db_connection.execute(
      "SELECT `subservice`, `information` FROM `records` where `id` = ?",
      [req.query["id"]]
    );
    return res.json({ success: true, listall: rows, });
  } catch (err) {
    console.log(err);
  }
});

app.get("/search", async (req, res) => {
  // console.log(req.params("subservice"));
  try {
    req.query["subservice"] = "%" + req.query["subservice"] + "%";
    const [rows] = await db_connection.execute(
      "SELECT `id`, `subservice` FROM `records` where `subservice` LIKE ?",
      [req.query["subservice"]]
    );
    return res.json({ success: true, listall: rows, });
  } catch (err) {
    console.log(err);
  }
});

app.post("/addSubService", async (req, res) => {
    // console.log(req.body);
  try {
    const [rows] = await db_connection.execute(
      "INSERT INTO `records` (`service`,`subservice`,`information`) VALUES(?, ?, ?)",
      [req.body.service, req.body.subservice, req.body.information]
    );
    if (rows.affectedRows === 1) {
      return res.json({ success: true });
    }
  } catch (err) {
    
    console.log(err);
  }
});

app.post("/editSubService", async (req, res) => {
  try {
    const [update] = await db_connection.execute(
      "UPDATE `records` SET `service`=?, `subservice`=?,`information`=? WHERE id = ?",
      [
        req.body.service,
        req.body.subservice,
        req.body.information,
        req.body.id,
      ]
    );
    if (update.affectedRows === 1) {
      return res.json({ success: true });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/fiveRandomSubServices", async (req, res) => {
  try {
    const [rows] = await db_connection.execute(
      "SELECT `id`, `subservice` FROM  `records` ORDER BY rand() limit 5"
    );
    if (rows.length > 0) {
      return res.json({ success: true, listId: rows, });
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
