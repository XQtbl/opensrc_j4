var express = require("express");
var cors = require("cors");
var db = require("./database");
const app = express();
const port = 3000;

app.use(cors());

app.get("/", function (req, res) {
    res.send("this is a server for SSU opensource project.");
});

app.get("/sound/:name", (req, res) => {
    const { name } = req.params;

    if (name === "dog") {
        res.json({ sound: "멍멍" });
    } else if (name === "cat") {
        res.json({ sound: "야옹" });
    } else {
        res.json({ sound: "알 수 없음" });
    }
});

app.get("/database/insert", (req, res) => {
    var contents = req.query;

    db.insertDB(contents[0], contents[1], contents[2], "메모");
    res.send("HI");
});

app.listen(port);
