const router = require("express").Router();

module.exports = (app, dbConfig) => {
  /* --------------------------------------------------- */
  /*  홈화면 게시글 조회                                  */
  /* --------------------------------------------------- */
  //내 답변 데이터 출력
  router.get("/:selected", async (req, res) => {
    //params
    const selected = req.params.selected;
    // console.log(`selected: ${selected}`);

    let orderBy =
      selected === "latest"
        ? "reg_date DESC"
        : selected === "bestView"
        ? "list_view_cnt DESC"
        : "list_ans_cnt DESC";

    //sql
    let sql = `
      SELECT  A.list_no                          AS list_no
             ,A.list_title                       AS list_title
             ,A.list_writer                      AS list_writer
             ,LEFT(A.list_ctnt,500)              AS list_ctnt
             ,A.list_writer                      AS list_writer
             ,A.list_view_cnt                    AS list_view_cnt
             ,A.list_ans_cnt                     AS list_ans_cnt
             ,TIMESTAMPDIFF(minute, DATE_FORMAT(CONCAT(A.reg_date, ' ', A.reg_time), '%Y-%m-%d %H:%i'), DATE_FORMAT(CONCAT(CURDATE(),' ',CURTIME()), '%Y-%m-%d %H:%i')) AS timediff
             ,(SELECT user_img      FROM members  /* 회원관리 */
                WHERE 1 = 1
                  AND user_email = A.reg_id)     AS user_img
       FROM board_list A
      WHERE 1 = 1
        -- AND DATE_FORMAT(reg_date, '%Y-%m-%d') BETWEEN DATE_ADD(NOW(),INTERVAL -7 DAY) AND NOW()
      ORDER BY ${orderBy}
      LIMIT 0, 5
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
