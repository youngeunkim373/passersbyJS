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

  /* --------------------------------------------------- */
  /*  회원가입 이메일 본인인증                            */
  /* --------------------------------------------------- */
  router.post("/signup/sendEmail", async (req, res) => {
    let email = req.body.email;

    //sql
    let sql = `
    SELECT  COUNT(*)      AS checkDup 
      FROM members A  /* 회원관리 */
     WHERE 1 = 1
       AND A.user_email = '${email}'
    `;

    await dbConfig.query(sql, (err, data) => {
      if (err) {
        console.log(err.message);
        console.log(`sql: ${sql}`);
        return;
      }

      //이메일 중복체크
      let checkDup = data[0].checkDup;
      let number = null;

      if (checkDup === 0) {
        //랜덤 6자리 만들기
        number = Math.floor(100000 + Math.random() * 900000);
        // console.log(`email: ${email} / number: ${number}`);

        let info = transporter.sendMail({
          from: "youngeunkim373@gmail.com", //보내는 이메일
          to: email, //받는사람 이메일
          subject: "길 가는 사람들 본인인증 메일", //메일 제목
          text: `길 가는 사람들 본인인증 메일입니다. 아래의 번호를 회원가입 창의 인증번호란에 입력해주세요.
           ${number}`, //내용
        });

        let checkEmail = new Object();
        checkEmail.number = number;
      }
      res.send({ checkDup: checkDup, number: number });
    });
  });

  /* --------------------------------------------------- */
  /*  회원가입                                           */
  /* --------------------------------------------------- */
  router.post("/signup", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let nickname = req.body.nickname;
    let sex = req.body.sex;
    let age = req.body.age;
    let region = req.body.region;
    // console.log(
    //   `email: ${email} / password: ${password} / nickname: ${nickname} / sex: ${sex} / age: ${age} / region: ${region}`
    // );

    let sql01 = `
    SELECT  COUNT(*)             AS NickNmDup
      FROM members A
     WHERE 1 = 1
       AND A.user_nicknm = '${nickname}'
  `;

    dbConfig.query(sql01, (err, data01) => {
      if (err) {
        console.log(err.message);
        console.log(`sql01: ${sql01}`);
        return;
      }

      // console.log(data01[0].NickNmDup);
      if (data01[0].NickNmDup === 0) {
        let sql02 = `
        INSERT INTO members  /* 회원관리 */
                     (
                       user_email        -- 회원_이메일
                      ,user_pw           -- 회원_비밀번호
                      ,user_nicknm       -- 회원_닉네임
                      ,user_sex          -- 회원_성별(여:F/남:M)
                      ,user_age          -- 회원_연령
                      ,user_region       -- 회원_지역
                      ,reg_id            -- 등록_id
                      ,reg_date          -- 등록_일자
                      ,reg_time          -- 등록_시간
                     )
                VALUES
                     (
                       '${email}'
                      ,'${password}'
                      ,'${nickname}'
                      ,'${sex}'
                      ,'${age}'
                      ,'${region}'
                      ,'${email}'
                      ,CURDATE()
                      ,CURTIME()
                     )
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

  /* --------------------------------------------------- */
  /*  이메일 찾기 조회                                    */
  /* --------------------------------------------------- */
  router.get("/signin/findemail/:email", async (req, res) => {
    //params
    const email = req.params.email;
    console.log(`email: ${email}`);

    let sql = `
    SELECT COUNT(*)         AS checkEmail
      FROM members  /* 회원관리 */
     WHERE 1 = 1
       AND user_email = '${email}'
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
  /*  비밀번호 찾기 조회 및 이메일 전송                   */
  /* --------------------------------------------------- */
  router.get("/signin/findpassword/:email", async (req, res) => {
    //params
    const email = req.params.email;
    // console.log(`email: ${email}`);

    let sql = `
    SELECT COUNT(*)         AS checkEmail
      FROM members  /* 회원관리 */
     WHERE 1 = 1
       AND user_email = '${email}'
  `;

    dbConfig.query(sql, (err, data) => {
      if (err) {
        console.log(err.message);
        console.log(`sql: ${sql}`);
        return;
      }

      // console.log(data[0].checkEmail);
      if (data[0].checkEmail > 0) {
        let info = transporter.sendMail({
          from: "youngeunkim373@gmail.com", //보내는 이메일
          to: email, //받는사람 이메일
          subject: "길 가는 사람들 비밀번호 변경 링크입니다.", //메일 제목
          text: `길 가는 사람들 비밀번호 변경 메일입니다. 아래의 링크에서 비밀번호를 변경하세요. http://localhost:3000/CreatePw/${email}`, //내용
        });
      }

      res.send(data);
    });
  });

  /* --------------------------------------------------- */
  /*  비밀번호 변경                                       */
  /* --------------------------------------------------- */
  router.post("/createpw", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    // console.log(`email: ${email} / password: ${password}`);

    let sql = `
    UPDATE members  /* 회원관리 */
       SET  user_pw = '${password}'
     WHERE 1 = 1
       AND user_email = '${email}'
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
