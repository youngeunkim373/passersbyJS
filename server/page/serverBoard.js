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

  /* --------------------------------------------------- */
  /*  게시판 스레드 조회                                  */
  /* --------------------------------------------------- */
  router.get("/thread/:no", async (req, res) => {
    //params
    const no = req.params.no;
    // console.log(`no: ${no}`);

    let sql01 = `
    UPDATE board_list  /* 게시판리스트 */
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
           ,A.reg_id                           AS reg_id
           ,A.reg_date                         AS reg_date
           ,A.reg_time                         AS reg_time
           ,TIMESTAMPDIFF(minute, DATE_FORMAT(CONCAT(A.reg_date, ' ', A.reg_time), '%Y-%m-%d %H:%i'), DATE_FORMAT(CONCAT(CURDATE(),' ',CURTIME()), '%Y-%m-%d %H:%i')) AS timediff
           ,(SELECT user_img      FROM members  /* 회원관리 */
              WHERE 1 = 1
                AND user_email = A.reg_id)     AS user_img
     FROM board_list A
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
  /*  게시판 답변 등록                                    */
  /* --------------------------------------------------- */
  router.get("/answer", async (req, res) => {
    //params
    const list_no = req.query.list_no;
    const ans_seq = req.query.ans_seq;
    const user_email = req.query.user_email;
    // console.log(
    //   `list_no: ${list_no} / ans_seq: ${ans_seq} / user_email: ${user_email}`
    // );

    //sql
    let sql01 = `
    SELECT  COUNT(*)          AS checkDup
      FROM board_answer_log A  /* 게시판답변로그 */
     WHERE 1 = 1
       AND A.list_no = '${list_no}'
       AND A.reg_id = '${user_email}'
  `;

    dbConfig.query(sql01, (err, data) => {
      if (err) {
        console.log(err.message);
        console.log(`sql01: ${sql01}`);
        return;
      }

      let checkDup = data[0].checkDup;
      // console.log(`checkDup: ${checkDup}`);
      if (checkDup === 0) {
        //sql
        let sql02 = `
        INSERT INTO board_answer_log  /* 게시판답변로그 */
                     (
                       list_no           -- 리스트번호
                      ,ans_seq           -- 답변순번
                      ,user_nicknm       -- 회원닉네임
                      ,user_sex          -- 회원성별(여:F/남:M)
                      ,user_age          -- 회원연령
                      ,user_region       -- 회원지역
                      ,reg_id            -- 등록_id
                      ,reg_date          -- 등록_일자
                      ,reg_time          -- 등록_시간
                     )
                VALUES
                     (
                       '${list_no}'
                      ,'${ans_seq}'
                      ,(SELECT user_nicknm     FROM members /* 회원관리 */
                         WHERE 1 = 1
                           AND user_email = '${user_email}')
                      ,(SELECT user_sex     FROM members /* 회원관리 */
                         WHERE 1 = 1
                           AND user_email = '${user_email}')
                      ,(SELECT user_age     FROM members /* 회원관리 */
                         WHERE 1 = 1
                           AND user_email = '${user_email}')
                      ,(SELECT user_region     FROM members /* 회원관리 */
                         WHERE 1 = 1
                           AND user_email = '${user_email}')
                      ,'${user_email}'
                      ,CURDATE()
                      ,CURTIME()
                     )
        `;

        dbConfig.query(sql02, (err, data) => {
          if (err) {
            console.log(err.message);
            console.log(`sql02: ${sql02}`);
            return;
          }

          // res.send(data);
        });

        let sql03 = `
        UPDATE board_answer_m  /* 게시판답변기본 */
           SET  ans_sel_cnt = ifnull(ans_sel_cnt, 0)+1
         WHERE 1 = 1
           AND list_no = '${list_no}'
           AND ans_seq = '${ans_seq}'
        `;

        dbConfig.query(sql03, (err, data) => {
          if (err) {
            console.log(err.message);
            console.log(`sql03: ${sql03}`);
            return;
          }
          // res.send(data);
        });

        let sql04 = `
        UPDATE board_list  /* 게시판리스트 */
           SET  list_ans_cnt = ifnull(list_ans_cnt, 0)+1
         WHERE 1 = 1
           AND list_no = '${list_no}'
        `;

        dbConfig.query(sql04, (err, data) => {
          if (err) {
            console.log(err.message);
            console.log(`sql04: ${sql04}`);
            return;
          }
          // res.send(data);
        });
      }
      res.send(data);
    });
  });

  /* --------------------------------------------------- */
  /*  게시판 통계자료 조회                                */
  /* --------------------------------------------------- */
  router.get("/stats/:no/:email", async (req, res) => {
    //params
    let no = req.params.no;
    let email = req.params.email;
    // console.log(`no: ${no} / email:${email}`);

    let sql01 = `
    SELECT  REPLACE(A.ans_ctnt, '&nbsp;', '')            AS ans_ctnt
           ,IFNULL(A.ans_sel_cnt,0)                      AS ans_sel_cnt
           ,IFNULL(B.user_sex_f,0)                       AS user_sex_f
           ,IFNULL(B.user_sex_m,0)                       AS user_sex_m
           ,IFNULL(B.user_age_0,0)                       AS user_age_0
           ,IFNULL(B.user_age_10,0)                      AS user_age_10
           ,IFNULL(B.user_age_20,0)                      AS user_age_20
           ,IFNULL(B.user_age_30,0)                      AS user_age_30
           ,IFNULL(B.user_age_40,0)                      AS user_age_40
           ,IFNULL(B.user_age_50,0)                      AS user_age_50
           ,IFNULL(B.user_age_60,0)                      AS user_age_60
           ,IFNULL(B.user_age_70,0)                      AS user_age_70
           ,IFNULL(B.user_age_80,0)                      AS user_age_80
           ,IFNULL(B.user_age_90,0)                      AS user_age_90
           ,IFNULL(B.user_age_100,0)                     AS user_age_100
           ,IFNULL(B.user_region_seoul,0)                AS user_region_seoul      
           ,IFNULL(B.user_region_gyeonggi,0)             AS user_region_gyeonggi   
           ,IFNULL(B.user_region_gwangju,0)              AS user_region_gwangju    
           ,IFNULL(B.user_region_daegu,0)                AS user_region_daegu      
           ,IFNULL(B.user_region_daejeon,0)              AS user_region_daejeon    
           ,IFNULL(B.user_region_busan,0)                AS user_region_busan      
           ,IFNULL(B.user_region_incheon,0)              AS user_region_incheon    
           ,IFNULL(B.user_region_ulsan,0)                AS user_region_ulsan      
           ,IFNULL(B.user_region_sejong,0)               AS user_region_sejong     
           ,IFNULL(B.user_region_jeju,0)                 AS user_region_jeju       
           ,IFNULL(B.user_region_gangwon,0)              AS user_region_gangwon    
           ,IFNULL(B.user_region_gyeongsang,0)           AS user_region_gyeongsang 
           ,IFNULL(B.user_region_jeolla,0)               AS user_region_jeolla     
           ,IFNULL(B.user_region_chungcheong,0)          AS user_region_chungcheong
           ,(SELECT ans_seq     FROM board_answer_log  /* 게시판답변로그 */
              WHERE 1 = 1
                AND list_no = A.list_no
                AND reg_id = A.reg_id)                   AS my_answer
      FROM board_answer_m A  /* 게시판답변기본 */
      LEFT OUTER JOIN board_answer_stats B  /* 게시판답변통계 */
              ON B.list_no  =  A.list_no
             AND B.ans_seq  =  A.ans_seq
     WHERE 1 = 1
       AND A.list_no = '${no}'
    `;

    dbConfig.query(sql01, (err, data01) => {
      if (err) {
        console.log(err.message);
        console.log(`sql: ${sql01}`);
        return;
      }

      let sql02 = `
      SELECT B.ans_ctnt          AS my_answer
        FROM board_answer_log A  /* 게시판답변로그 */
        LEFT OUTER JOIN board_answer_m B  /* 게시판답변기본 */
                ON B.list_no  =  A.list_no
               AND B.ans_seq  =  A.ans_seq
       WHERE 1 = 1
         AND A.list_no = '${no}'
         AND A.reg_id = '${email}'
      `;

      dbConfig.query(sql02, (err, data02) => {
        if (err) {
          console.log(err.message);
          console.log(`sql02: ${sql02}`);
          return;
        }

        res.send({
          data: data01,
          myAnswer: data02.length !== 0 ? data02[0].my_answer : null,
        });
      });
    });
  });

  /* --------------------------------------------------- */
  /*  게시판 댓글 조회                                    */
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
                FROM board_comment A  /* 게시판댓글관리 */
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
                FROM board_nested_comment A  /* 게시판대댓글관리 */
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
      SELECT  (SELECT COUNT(*)     FROM board_comment
                WHERE 1 = 1
                  AND list_no = '${no}' )
            + (SELECT COUNT(*)     FROM board_nested_comment
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
              FROM board_comment A  /* 게시판댓글관리 */
             WHERE 1 = 1
               AND list_no = '${no}'
      ) AA,
      (     SELECT COUNT(*)          AS pageCnt
              FROM board_nested_comment B  /* 게시판대댓글관리 */
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
  /*  게시판 댓글 입력                                    */
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
      INSERT INTO board_comment  /* 게시판댓글관리 */
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
                    ,(SELECT IFNULL(MAX(cmnt_seq),0) + 1     FROM board_comment as subtable
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
      INSERT INTO board_nested_comment  /* 게시판대댓글관리 */
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
                    ,(SELECT IFNULL(MAX(nested_cmnt_seq),0) + 1     FROM board_nested_comment as subtable
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

  /* --------------------------------------------------- */
  /*  게시판 게시글 저장                                  */
  /* --------------------------------------------------- */
  //첨부파일 처리
  //https://github.com/expressjs/multer/blob/master/doc/README-ko.md -> multer 이용법
  // router.use("/file/", express.static("../public/upload/board"));

  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "../public/upload/board");
  //   },
  //   filename: (req, file, cb) => {
  //     let email = req.body.email;
  //     const newFileName = email + "_" + Date.now() + "_" + file.originalname;
  //     cb(null, newFileName);
  //   },
  // });

  // let uploadBoard = multer({ storage: storage });

  //DB에 데이터 처리
  //router.post("/write", uploadBoard.array("file", 5), async (req, res) => {
  router.post("/write", async (req, res) => {
    let title = req.body.title;
    let writer = req.body.writer;
    let content = req.body.content;
    let email = req.body.email;

    //이미지 삭제
    fs.readdir("../public/upload/temporary/", (err, files) => {
      for (var i = 0; i < files.length; i++) {
        console.log(`1: ${email} / ${files[i]}`);
        if (files[i].includes(email)) {
          console.log(`2: ${email} / ${files[i]}`);
          fs.rename(
            `../public/upload/temporary/${files[i]}`,
            `../public/upload/board/${files[i]}`,
            function (err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully renamed the directory.");
              }
            }
          );
          //fs.unlinkSync(`../public/upload/temporary/${files[i]}`);

          // console.log(files[i].filename);
          // content = content.replace(
          //   `/upload/board/${files[i]}`,
          //   `/upload/board/${files[i].filename}`
          // );
          // console.log(content);
        }
        // });
      }
    });

    let sql01 = `
    SELECT  CONCAT( DATE_FORMAT(CURDATE(), '%Y%m%d')
                   ,LPAD(ifnull(RIGHT(MAX(list_no),5),0)+1, 5, 0))     AS new_list_no
      FROM board_list A
     WHERE 1 = 1
       AND A.reg_date = CURDATE()
    `;

    dbConfig.query(sql01, (err, data) => {
      if (err) {
        console.log(err.message);
        console.log(`sql01: ${sql01}`);
        return;
      }

      let new_list_no = data[0].new_list_no;
      // console.log(`new_list_no: ${new_list_no}`);

      let sql02 = `
      INSERT INTO board_list  /* 게시판리스트 */
                   (
                     list_no           -- 리스트_순번
                    ,list_title        -- 리스트_제목
                    ,list_writer       -- 리스트_작성자
                    ,list_ctnt         -- 리스트_내용
                    ,reg_id            -- 등록_id
                    ,reg_date          -- 등록_일자
                    ,reg_time          -- 등록_시간
                   )
              VALUES
                   (
                     '${new_list_no}'
                    ,'${title}'
                    ,'${writer}'
                    ,'${content}'
                    ,'${email}'
                    ,CURDATE()
                    ,CURTIME()
                   )
      `;

      dbConfig.query(sql02, (err, data) => {
        if (err) {
          console.log(err.message);
          console.log(`sql02: ${sql02}`);
          return;
        }

        // res.send(data);
      });

      let answerCnt = content.split("<em>").length - 1;
      //console.log(`answerCnt: ${answerCnt}`);

      for (var i = 0; i < answerCnt; i++) {
        let answer = content.substring(
          content.indexOf("<em>") + 4,
          content.indexOf("</em>")
        );
        // console.log(`answer: ${answer} / content:${content}`);

        let sql03 = `
        INSERT INTO board_answer_m  /* 게시판답변기본 */
                     (
                       list_no           -- 리스트_순번
                      ,ans_seq           -- 답변순번
                      ,ans_ctnt          -- 답변내용
                      ,ans_sel_cnt       -- 답변선택_횟수
                      ,reg_id            -- 등록_id
                      ,reg_date          -- 등록_일자
                      ,reg_time          -- 등록_시간
                     )
                VALUES
                     (
                       '${new_list_no}'
                      ,(SELECT ifnull(MAX(ans_seq),0)+1     FROM board_answer_m as subtable
                         WHERE 1 = 1
                           AND list_no = '${new_list_no}')
                      ,REPLACE('${answer}', '&nbsp;', '')
                      ,null
                      ,'${email}'
                      ,CURDATE()
                      ,CURTIME()
                     )
      `;

        dbConfig.query(sql03, (err, data) => {
          if (err) {
            console.log(err.message);
            console.log(`sql03: ${sql03}`);
            return;
          }

          // res.send(data);
        });
        content = content.replace(
          content.substring(
            content.indexOf("<em>"),
            content.indexOf("</em>") + 5
          ),
          ""
        );
      }
      res.send(data);
    });
  });

  /* --------------------------------------------------- */
  /*  temporary 폴더 이미지 삭제                          */
  /* --------------------------------------------------- */
  router.get("/write/deleteimage/:email", async (req, res) => {
    const email = req.params.email;
    // console.log(`email: ${email}`);
    fs.readdir("../public/upload/temporary/", (err, files) => {
      files.forEach((file) => {
        if (file.includes(email)) {
          fs.unlinkSync(`../public/upload/temporary/${file}`);
        }
      });
    });
  });

  return router;
};
