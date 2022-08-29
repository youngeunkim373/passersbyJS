const router = require("express").Router();

module.exports = (app, dbConfig, multer, bodyparser, express, fs) => {
  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({ extended: true }));

  /* --------------------------------------------------- */
  /*  게시판 리스트 조회                                  */
  /* --------------------------------------------------- */
  //게시판 데이터 출력
  router.get("/data", async (req, res) => {
    //params
    const option = req.query.option;
    const search = req.query.search;
    const page = parseInt(req.query.page);
    // console.log(`params: ${option} / ${search} /${page}`);

    const rowCnt = 10;
    const curPage = rowCnt * (page - 1);
    // console.log(`curPage: ${curPage}`);

    //sql
    let sql = `
    SELECT  A.list_no                          AS list_no
           ,A.list_title                       AS list_title
           ,A.list_writer                      AS list_writer
           ,LEFT(A.list_ctnt,500)              AS list_ctnt
           ,A.list_view_cnt                    AS list_view_cnt
           ,A.list_ans_cnt                     AS list_ans_cnt
           ,A.reg_id                           AS reg_id
           ,A.reg_date                         AS reg_date
           ,A.reg_time                         AS reg_time
           ,TIMESTAMPDIFF(minute, DATE_FORMAT(CONCAT(A.reg_date, ' ', A.reg_time), '%Y-%m-%d %H:%i'), DATE_FORMAT(CONCAT(CURDATE(),' ',CURTIME()), '%Y-%m-%d %H:%i')) AS timediff
           ,(SELECT user_img      FROM members  /* 회원관리 */
              WHERE 1 = 1
                AND user_email = A.reg_id)     AS user_img
      FROM board_list A
     WHERE 1 = 1
  `;
    if (search !== "") {
      sql += `
    AND (A.list_title LIKE '%${search}%' OR A.list_ctnt LIKE '%${search}%')
    `;
    }
    sql += `
    ORDER BY ${option}
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

  //게시판 페이지 출력
  router.get("/page", async (req, res) => {
    //params
    const search = req.query.search;
    //sql
    let sql = `
    SELECT IF(MOD(COUNT(*), 10) = 0
              ,COUNT(*) DIV 10  
              ,COUNT(*) DIV 10   +1
           )        AS pageCnt
     FROM board_list A
    WHERE 1 = 1
  `;
    if (search !== "") {
      sql += `
      AND (A.list_title LIKE '%${search}%' OR A.list_ctnt LIKE '%${search}%')
    `;
    }

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
