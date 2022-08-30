const router = require("express").Router();

module.exports = (app, dbConfig, multer, bodyparser, express, fs) => {
  /* --------------------------------------------------- */
  /*  내 프로필 조회                                      */
  /* --------------------------------------------------- */
  router.get("/profile/myprofile/:email", async (req, res) => {
    //params
    let email = req.params.email;
    // console.log(`params: ${email}`);

    //sql
    let sql = `
      SELECT  A.user_email          AS email
             ,A.user_nicknm         AS nicknm
             ,A.user_sex            AS sex
             ,A.user_age            AS age
             ,A.user_region         AS region
             ,A.user_img            AS image
        FROM members A  /* 회원관리 */
       WHERE 1 = 1
         AND A.user_email = '${email}'
    `;

    dbConfig.query(sql, (err, data) => {
      if (err) {
        console.log(err.message);
        console.log(`sql: ${sql}`);
        return;
      }

      res.send(data);
    });
  });

  /* --------------------------------------------------- */
  /*  프로필이미지 변경                                   */
  /* --------------------------------------------------- */
  //첨부파일 처리
  //https://github.com/expressjs/multer/blob/master/doc/README-ko.md -> multer 이용법
  router.use("/file/", express.static("../../public/upload/profileImage"));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../public/upload/profileImage");
    },
    filename: (req, file, cb) => {
      let email = req.body.email;
      let image = decodeURIComponent(req.body.image);
      const newFileName = email + "_" + image;
      cb(null, newFileName);
    },
  });

  // let uploadProfile = multer({ dest: "../src/upload/profileImage" }); //dest: 파일이 저장될 위치
  let uploadProfile = multer({ storage: storage });

  //DB에 데이터 처리 + 파일 처리
  router.put(
    "/profile/myprofile/image",
    uploadProfile.single("file"),
    async (req, res) => {
      //파일선택을 안했으면 진행 X
      if (req.file != undefined) {
        let email = req.body.email;
        let image = decodeURIComponent(req.body.image);
        let file = req.file.originalname;
        // console.log(`email: ${email} / image: ${image} / file: ${file}`);

        let sql01 = `
            SELECT A.user_img     AS image
              FROM members A  /* 회원관리 */
             WHERE 1 = 1
               AND user_email = '${email}'
      `;

        dbConfig.query(sql01, (err, data) => {
          if (err) {
            console.log(err.message);
            console.log(`sql01: ${sql01}`);
            return;
          }

          //이전 이미지파일명
          let prevImg = data[0].image;

          //DB 처리
          let sql02 = `
              UPDATE members  /* 회원관리 */
                 SET user_img = '${email + "_" + image}'
               WHERE 1 = 1
                 AND user_email = '${email}'
        `;

          dbConfig.query(sql02, (err, data) => {
            if (err) {
              console.log(err.message);
              console.log(`sql02: ${sql02}`);
              return;
            }

            //파일삭제
            // console.log(`prevImg: ${prevImg}`);
            if (prevImg !== null) {
              fs.unlink(`../public/upload/profileImage/${prevImg}`, (err) => {
                // if (err.code == "ENOENT") {
                //   console.log("파일 삭제 Error 발생");
                // }
              });
            }

            res.send(email + "_" + image);
          });
        });
      }
    }
  );

  /* --------------------------------------------------- */
  /*  회원정보 변경                                       */
  /* --------------------------------------------------- */
  //DB에 데이터 처리
  router.put("/profile/myprofile/update", async (req, res) => {
    let email = req.body.email;
    let nicknm = req.body.nicknm;
    let sex = req.body.sex;
    let age = req.body.age;
    let region = req.body.region;
    let initNicknm = req.body.initNicknm;
    // console.log(
    //   `email: ${email} / nicknm: ${nicknm} / sex: ${sex} / age: ${age} / region: ${region} / initNicknm: ${initNicknm}`
    // );

    let sql01 = `
    SELECT  COUNT(*)             AS NickNmDup
      FROM members A
     WHERE 1 = 1
       AND A.user_nicknm = '${nicknm}'
  `;

    dbConfig.query(sql01, (err, data01) => {
      if (err) {
        console.log(err.message);
        console.log(`sql01: ${sql01}`);
        return;
      }

      if (data01[0].NickNmDup === 0 || nicknm === initNicknm) {
        let sql02 = `
        UPDATE  members  /* 회원관리 */
           SET  user_nicknm = '${nicknm}'
               ,user_sex    = '${sex}'
               ,user_region = '${region}'
         WHERE 1 = 1
           AND user_email = '${email}'
      `;

        dbConfig.query(sql02, (err, data02) => {
          if (err) {
            console.log(err.message);
            console.log(`sql02: ${sql02}`);
            return;
          }
          //res.send(data);
        });
      }

      res.send(data01);
    });
  });

  return router;
};
