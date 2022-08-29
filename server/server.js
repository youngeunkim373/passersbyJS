const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const mysql = require("mysql");
const path = require("path");
const os = require("os");
const dbConfig = require("./dbConfig");

const app = express();
const PORT = process.env.PORT || 4000;

//서버 연결 확인
app.listen(PORT, () => {
  console.log(`Check out the app at http://localhost:${PORT}`);
});

//DB 연결 확인
// app.get("/api/getUsername", function (req, res, next) {
//   res.send({ username: os.userInfo().username });
// });

//데이터 타입 설정
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//클라이언트에서 withCredentials가 true로 설정되어 있으면 origin 값을 명확히 명시해야 함
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/test", async (req, res) => {
    //sql
    let sql = `
    SELECT  list_no
      FROM board_list A
     WHERE 1 = 1
  `;

    dbConfig.query(sql, (err, data) => {
      if (err) {
        console.log(err.message);
        console.log(`sql: ${sql}`);
        return;
      }
      console.log(data);
      res.send(data);
    });
  });

