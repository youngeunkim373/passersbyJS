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

  return router;
};
