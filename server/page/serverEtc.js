const router = require("express").Router();

module.exports = (app, dbConfig, multer, bodyparser, express, fs) => {
  /* --------------------------------------------------- */
  /*  Editor.js                                          */
  /* --------------------------------------------------- */
  //첨부파일 처리
  router.use("/file/", express.static("../public/upload/temporary"));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../public/upload/temporary");
    },
    filename: (req, file, cb) => {
      let email = req.body.email;
      let image = decodeURIComponent(req.body.image);
      const newFileName = email + "_" + file.originalname;
      cb(null, newFileName);
    },
  });

  let uploadImage = multer({ storage: storage });

  router.put("/editorurl", uploadImage.array("file", 5), async (req, res) => {
    let urlArr = new Array();
    for (let i = 0; i < req.files.length; i++) {
      urlArr.push(`/upload/temporary/${req.files[i].filename}`);
    }
    // console.log(urlArr);
    res.send(urlArr);
  });

  return router;
};
