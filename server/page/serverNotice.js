const router = require("express").Router();

module.exports = (app, dbConfig) => {
  /* --------------------------------------------------- */
  /*  공지사항 리스트 조회                                */
  /* --------------------------------------------------- */
  //공지사항 데이터 출력
  router.get("/list", async (req, res) => {
    //params
    const page = parseInt(req.query.page);
    // console.log(`params: ${page}`);

    const rowCnt = 10;
    const curPage = rowCnt * (page - 1);
    // console.log(`curPage: ${curPage}`);

    //sql
    let sql = `
    SELECT  A.list_no                          AS list_no
           ,A.list_title                       AS list_title
           ,A.list_writer                      AS list_writer
           ,A.list_ctnt                        AS list_ctnt
           ,A.list_view_cnt                    AS list_view_cnt
           ,A.list_ans_cnt                     AS list_ans_cnt
           ,TIMESTAMPDIFF(minute, DATE_FORMAT(CONCAT(A.reg_date, ' ', A.reg_time), '%Y-%m-%d %H:%i'), DATE_FORMAT(CONCAT(CURDATE(),' ',CURTIME()), '%Y-%m-%d %H:%i')) AS timediff
           ,(SELECT user_img      FROM members  /* 회원관리 */
              WHERE 1 = 1
                AND user_email = A.reg_id)     AS user_img
      FROM notice_list A  /* 공지사항리스트 */
     WHERE 1 = 1
     ORDER BY reg_date DESC, reg_time DESC
     LIMIT ${curPage}, ${rowCnt}
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

  //공지사항 페이지 출력
  router.get("/page", async (req, res) => {
    //params
    const search = req.query.search;
    //sql
    let sql = `
    SELECT IF(MOD(COUNT(*), 10) = 0
              ,COUNT(*) DIV 10  
              ,COUNT(*) DIV 10   +1
           )        AS pageCnt
     FROM notice_list A  /* 공지사항리스트 */
    WHERE 1 = 1
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
  /*  공지사항 스레드 조회                                */
  /* --------------------------------------------------- */
  router.get("/thread/:no", async (req, res) => {
    //params
    const no = req.params.no;
    // console.log(`no: ${no}`);

    let sql01 = `
    UPDATE notice_list  /* 공지사항리스트 */
       SET  list_view_cnt = ifnull(list_view_cnt,0) + 0.5
     WHERE 1 = 1
       AND list_no = '${no}'
  `;

    dbConfig.query(sql01, (err, data) => {
      if (err) {
        console.log(err.message);
        console.log(`sql01: ${sql01}`);
        return;
      }
      // res.send(data);
    });

    //sql
    let sql02 = `
    SELECT  A.list_no                          AS list_no
           ,A.list_title                       AS list_title
           ,A.list_writer                      AS list_writer
           ,A.list_ctnt                        AS list_ctnt
           ,A.list_view_cnt                    AS list_view_cnt
           ,A.list_ans_cnt                     AS list_ans_cnt
           ,TIMESTAMPDIFF(minute, DATE_FORMAT(CONCAT(A.reg_date, ' ', A.reg_time), '%Y-%m-%d %H:%i'), DATE_FORMAT(CONCAT(CURDATE(),' ',CURTIME()), '%Y-%m-%d %H:%i')) AS timediff
           ,(SELECT user_img      FROM members  /* 회원관리 */
              WHERE 1 = 1
                AND user_email = A.reg_id)     AS user_img
     FROM notice_list A  /* 공지사항리스트 */
    WHERE 1 = 1
      AND A.list_no = '${no}'
  `;

    dbConfig.query(sql02, (err, data) => {
      if (err) {
        console.log(err.message);
        console.log(`sql02: ${sql02}`);
        return;
      }

      res.send(data);
    });
  });

  /* --------------------------------------------------- */
  /*  공지사항 댓글 조회                                  */
  /* --------------------------------------------------- */
  //댓글 조회 처리
  router.get("/comment", async (req, res) => {
    //params
    const no = req.query.no;
    const page = parseInt(req.query.page);
    // console.log(`no: ${no} / ${page}`);

    const rowCnt = 10;
    const curPage = rowCnt * (page - 1);
    // console.log(`curPage: ${curPage}`);

    let sql01 = `
     SELECT   AA.list_no                    AS list_no
             ,AA.cmnt_seq                   AS cmnt_seq
             ,AA.nested_cmnt_seq            AS nested_cmnt_seq
             ,AA.cmnt_ctnt                  AS cmnt_ctnt
             ,AA.user_nicknm                AS user_nicknm
             ,AA.timediff                   AS timediff
             ,AA.user_img                   AS user_img
       FROM (
              SELECT  A.list_no                          AS list_no
                     ,A.cmnt_seq                         AS cmnt_seq
                     ,0                                  AS nested_cmnt_seq
                     ,A.cmnt_ctnt                        AS cmnt_ctnt
                     ,B.user_nicknm                      AS user_nicknm
                     ,TIMESTAMPDIFF(minute, DATE_FORMAT(CONCAT(A.reg_date, ' ', A.reg_time), '%Y-%m-%d %H:%i'), DATE_FORMAT(CONCAT(CURDATE(),' ',CURTIME()), '%Y-%m-%d %H:%i')) AS timediff
                     ,(SELECT user_img      FROM members  /* 회원관리 */
                        WHERE 1 = 1
                          AND user_email = A.reg_id)     AS user_img
                FROM notice_comment A  /* 공지사항댓글관리 */
                LEFT OUTER JOIN members B  /* 회원관리 */
                       ON B.user_email = A.reg_id
               WHERE 1 = 1
                 AND A.list_no = '${no}' 

              UNION ALL

              SELECT  A.list_no                          AS list_no
                     ,A.cmnt_seq                         AS cmnt_seq
                     ,A.nested_cmnt_seq                  AS nested_cmnt_seq
                     ,A.nested_cmnt_ctnt                 AS cmnt_ctnt
                     ,B.user_nicknm                      AS user_nicknm
                     ,TIMESTAMPDIFF(minute, DATE_FORMAT(CONCAT(A.reg_date, ' ', A.reg_time), '%Y-%m-%d %H:%i'), DATE_FORMAT(CONCAT(CURDATE(),' ',CURTIME()), '%Y-%m-%d %H:%i')) AS timediff
                     ,(SELECT user_img      FROM members  /* 회원관리 */
                        WHERE 1 = 1
                          AND user_email = A.reg_id)     AS user_img
                FROM notice_nested_comment A  /* 공지사항대댓글관리 */
                LEFT OUTER JOIN members B  /* 회원관리 */
                       ON B.user_email = A.reg_id
               WHERE 1 = 1
                 AND A.list_no = '${no}'   
            ) AA
      WHERE 1 = 1
      ORDER BY AA.list_no DESC, cmnt_seq DESC, nested_cmnt_seq ASC 
      LIMIT ${curPage}, ${rowCnt}
    `;

    dbConfig.query(sql01, (err, data01) => {
      if (err) {
        console.log(err.message);
        console.log(`sql01: ${sql01}`);
        return;
      }

      let sql02 = `
      SELECT  (SELECT COUNT(*)     FROM notice_comment  /* 공지사항댓글관리 */
                WHERE 1 = 1
                  AND list_no = '${no}' )
            + (SELECT COUNT(*)     FROM notice_nested_comment  /* 공지사항대댓글관리 */
                WHERE 1 = 1
                  AND list_no = '${no}' )          AS cmntCnt
       FROM DUAL
      `;

      dbConfig.query(sql02, (err, data02) => {
        if (err) {
          console.log(err.message);
          console.log(`sql02: ${sql02}`);
          return;
        }
        res.send({ data: data01, cmntCnt: data02[0].cmntCnt });
      });
    });
  });

  //댓글 페이지 처리
  router.get("/thread/page/:no", async (req, res) => {
    //params
    let no = req.params.no;
    // console.log(`no: ${no}`);

    //sql
    let sql = `
    SELECT IF(MOD(AA.pageCnt + BB.pageCnt, 10) = 0
              ,(AA.pageCnt + BB.pageCnt) DIV 10  
              ,(AA.pageCnt + BB.pageCnt) DIV 10   +1
             )                       AS pageCnt
      FROM(
            SELECT COUNT(*)          AS pageCnt
              FROM notice_comment A  /* 공지사항댓글관리 */
             WHERE 1 = 1
               AND list_no = '${no}'
      ) AA,
      (     SELECT COUNT(*)          AS pageCnt
              FROM notice_nested_comment A  /* 공지사항대댓글관리 */
             WHERE 1 = 1
               AND list_no = '${no}'
      ) BB
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
  /*  공지사항 댓글 입력                                  */
  /* --------------------------------------------------- */
  router.post("/thread/cmnt", async (req, res) => {
    let no = req.body.no;
    let id = req.body.cmntInput.id;
    let name = req.body.cmntInput.name;
    let value = req.body.cmntInput.value;
    let email = req.body.email;
    // console.log(
    //   `no: ${no} / id:${id} / name: ${name} / value: ${value} / email: ${email}`
    // );

    let sql01 = null;

    if (name === "cmnt") {
      sql01 = `
      INSERT INTO notice_comment  /* 공지사항댓글관리 */
                   (
                     list_no           -- 리스트번호
                    ,cmnt_seq          -- 댓글순번
                    ,cmnt_ctnt         -- 댓글내용
                    ,reg_id            -- 등록_id
                    ,reg_date          -- 등록_일자
                    ,reg_time          -- 등록_시간
                   )
              VALUES
                   (
                     '${no}'
                    ,(SELECT IFNULL(MAX(cmnt_seq),0) + 1     FROM notice_comment as subtable
                       WHERE 1 = 1
                         AND list_no = '${no}')
                    ,'${value}'
                    ,'${email}'
                    ,CURDATE()
                    ,CURTIME()
                   )
      `;
    } else {
      sql01 = `
      INSERT INTO notice_nested_comment  /* 공지사항대댓글관리 */
                   (
                     list_no           -- 리스트번호
                    ,cmnt_seq          -- 댓글순번
                    ,nested_cmnt_seq   -- 대댓글순번
                    ,nested_cmnt_ctnt  -- 대댓글내용
                    ,reg_id            -- 등록_id
                    ,reg_date          -- 등록_일자
                    ,reg_time          -- 등록_시간
                   )
              VALUES
                   (
                     '${no}'
                    ,'${id}'
                    ,(SELECT IFNULL(MAX(nested_cmnt_seq),0) + 1     FROM notice_nested_comment as subtable
                       WHERE 1 = 1
                         AND list_no = '${no}')
                    ,'${value}'
                    ,'${email}'
                    ,CURDATE()
                    ,CURTIME()
                   )
      `;
    }

    dbConfig.query(sql01, (err, data) => {
      if (err) {
        console.log(err.message);
        console.log(`sql01: ${sql01}`);
        return;
      }

      res.send(data);
    });
  });

  return router;
};
