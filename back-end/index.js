var express = require("express");
var cors = require("cors");
var db = require("./database");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.get("/", function (req, res) {
    res.send("this is a server for SSU opensource project.");
});

app.post("/database/insert", (req, res) => {
    var contents = req.body.data;
    db.insertDB(
        contents.cate,
        contents.address,
        contents.seriousness,
        contents.memo
    );
    db.readDB(contents.cate).then((resolveData) => {
        res.send(resolveData);
        console.log(resolveData);
    });
});

app.listen(port);
