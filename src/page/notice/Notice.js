import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//template
import NewIcon from "template/NewIcon";
import ProfileImage from "template/ProfileImage";
import Title from "template/Title";
import Pagination from "template/Pagination";
//function
import * as CD from "global/util/calcDate";

const Notice = () => {
  /*---------- set 함수 ----------*/
  const [notice, setNotice] = useState([]);
  const [page, setPage] = useState(1); //현재 페이지 위치
  const [pageCnt, setPageCnt] = useState(1); //한 페이지당 레코드 수

  /*---------- TableRow 클릭 이벤트 ----------*/
  let navigate = useNavigate();

  const clickTableRow = (no, e) => {
    navigate("/notice/thread/" + no);
  };

  /*---------- useEffect ----------*/
  // 최신게시글 & 페이지 데이터 출력
  useEffect(() => {
    async function fetchData01() {
      await axios
        .get(`${process.env.REACT_APP_API_ROOT}/notice/list`, {
          params: {
            page: page,
          },
        })
        .then((res) => {
          // console.log(res.data);
          setNotice(res.data);
        })
        .catch((error) => console.log(error.response));
    }
    fetchData01();

    async function fetchData02() {
      await axios
        .get(`${process.env.REACT_APP_API_ROOT}/notice/page`, {})
        .then((res) => {
          //console.log(`res.data.pageCnt: ${res.data[0].pageCnt}`);
          if (res.data[0].pageCnt > 0) {
            setPageCnt(res.data[0].pageCnt);
          }
        })
        .catch((error) => console.log(error.response));
    }
    fetchData02();
  }, [page]);

  /*---------- return ----------*/
  return (
    <div id="page" className="base-width">
      <Title title="공지사항" />
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            {notice.map((row) => (
              <TableRow
                key={row.list_no}
                height="20px"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "rgba(144, 0, 255, 0.02)", //Theme.themePurple
                  },
                }}
                onClick={(e) => {
                  clickTableRow(row.list_no, e);
                }}
              >
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "ibmLight",
                    fontSize: "18px",
                    padding: "0px 30px",
                  }}
                >
                  {parseInt(row.timediff) < 1440 && <NewIcon />}
                  <span className="left">{row.list_title}</span>
                </TableCell>
                <TableCell
                  align="right"
                  width="150px"
                  sx={{
                    fontFamily: "ibmLight",
                    minWidth: "200px",
                  }}
                >
                  <div className="right">
                    <ProfileImage image={row.user_img} />
                  </div>
                  <div className="PR10 right base-font">
                    <span>{row.list_writer}</span>
                    <p className="small-font">{CD.calcDate(row.timediff)}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="PT30">
        <Pagination pageCnt={pageCnt} setPage={setPage} />
      </div>
    </div>
  );
};

export default Notice;
