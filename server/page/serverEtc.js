const router = require("express").Router();

module.exports = (app, dbConfig, multer, bodyparser, express, fs) => {
  /* --------------------------------------------------- */
  /*  Editor.js                                          */
  /* --------------------------------------------------- */
  //첨부파일 처리
  router.use("/file/", express.static("./upload/temporary"));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./upload/temporary");
    },
    filename: (req, file, cb) => {
      let email = req.body.email;
      const newFileName = email + "_" + Date.now() + "_" + file.originalname;
      cb(null, newFileName);
    },
  });

  let uploadImage = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    onError: function (err, next) {
      console.log("error", err);
      return;
    },
  });

  router.put("/editorurl", uploadImage.array("file", 5), async (req, res) => {
    const urlArr = {};
    for (var i = 0; i < req.files.length; i++) {
      urlArr[i] = `/temporary/${req.files[i].filename}`;
    }
    res.json(urlArr);
  });

  // router.put("/editorurl", uploadImage.single("file"), async (req, res) => {
  //   //파일선택을 안했으면 진행 X
  //   if (req.file != undefined) {
  //     let email = req.body.email;
  //     const newFileName = email + "_" + Date.now() + "_" + file.originalname;

  //     res.send(newFileName);
  //   }
  // });

  return router;
};
