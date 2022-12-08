const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./db/mydb.db", (err) => {
    if (err) {
        console.log(err);
    }
});

function createTable() {
    db.run(
        "CREATE TABLE firedata(cate text not null, address text not null, seriousness int, memo text, created_time int)"
    );
}

// createTable(); // create data table

function insertData() {
    const nowTime = new Date().getTime();
    if (arguments.length == 0) {
        return;
    }
    const category = arguments[0];
    const location = arguments[1];
    const simgak = arguments[2];
    if (arguments.length == 3) {
        db.run(
            `INSERT INTO firedata(cate, address, seriousness, memo, created_time) VALUES("${category}", "${location}", "${simgak}", "", "${nowTime}")`,
            (err) => {
                if (err) {
                    return console.log(err.message);
                }
            }
        );
    } else {
        const note = arguments[3];
        db.run(
            `INSERT INTO firedata(cate, address, seriousness, memo, created_time) VALUES("${category}", "${location}", "${simgak}", "${note}", "${nowTime}")`,
            (err) => {
                if (err) {
                    return console.log(err.message);
                }
            }
        );
    }
}

// insertData("화재 발생", "숭실대", "3", "심각하네");

function readData(cate) {
    // 특정 사고명이 들어간 데이터를 가져온다.
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM firedata
    WHERE cate LIKE '%${cate}%' order by created_time desc`; // limit 개수 로 제한 가능

        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                // console.log(row);
            });
            resolve(rows);
        });
    });
}

// console.log("read data");
// var arr = [];

// readData("화재")
//     .then((resolveData) => {
//         // console.log(resolveData);
//         arr.push(resolveData);
//     })
//     .then(() => {
//         console.log(arr);
//         console.log("finish");
//     });

module.exports.insertDB = insertData;
module.exports.readDB = readData;
// db.close();
