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

  return router;
};
