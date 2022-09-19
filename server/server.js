const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const mysql = require("mysql");
const path = require("path");
const os = require("os");
const dbConfig = require("./dbConfig");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 4000;

//서버 연결 확인
app.listen(PORT, () => {
  console.log(`Check out the app at http://localhost:${PORT}`);
});

//데이터 타입 설정
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  //클라이언트에서 withCredentials가 true로 설정되어 있으면 origin 값을 명확히 명시해야 함
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
}

// 메일발송 함수
const transporter = nodemailer.createTransport({
  service: "gmail", //사용하고자 하는 서비스
  prot: 587,
  host: "smtp.gmlail.com",
  secure: false,
  requireTLS: true,
  auth: {
    user: "youngeunkim373@gmail.com", //gmail주소입력
    pass: "wcfvlmyolmphbmnx", //gmail패스워드 입력
  },
});

/* --------------------------------------------------- */
/*  페이지별 서버                                       */
/* --------------------------------------------------- */
const home = require("./page/serverHome")(app, dbConfig);
app.use("/home", home);

const notice = require("./page/serverNotice")(app, dbConfig);
app.use("/notice", notice);

const board = require("./page/serverBoard")(
  app,
  dbConfig,
  multer,
  bodyparser,
  express,
  fs
);
app.use("/board", board);

const member = require("./page/serverMember")(
  app,
  dbConfig,
  multer,
  bodyparser,
  express,
  transporter
);
app.use("/member", member);

const setting = require("./page/serverSetting")(
  app,
  dbConfig,
  multer,
  bodyparser,
  express,
  fs
);
app.use("/setting", setting);

const etc = require("./page/serverEtc")(
  app,
  dbConfig,
  multer,
  bodyparser,
  express,
  fs
);
app.use("/etc", etc);

/* --------------------------------------------------- */
/*  build용 path                                       */
/* --------------------------------------------------- */
const serveStatic = express.static(path.resolve("../build"), {
  index: false,
});
app.use(serveStatic);

const serveUpload = express.static(path.resolve("./upload"), {
  index: false,
});
app.use("/upload", serveUpload);

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../build/index.html"));
});
