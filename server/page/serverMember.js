const router = require("express").Router();

module.exports = (app, dbConfig, multer, bodyparser, express, transporter) => {
  /* --------------------------------------------------- */
  /*  로그인                                             */
  /* --------------------------------------------------- */
  router.post("/signin", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    // console.log(`email: ${email} / password: ${password}`);

    let sql = `
    SELECT  COUNT(*)             AS checkLogIn
           ,user_nicknm          AS nicknm
           ,user_img             AS user_img
      FROM members A
     WHERE 1 = 1
       AND A.user_email = '${email}'
       AND A.user_pw = '${password}'
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
