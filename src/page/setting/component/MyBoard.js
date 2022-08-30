import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SearchBar from "template/SearchBar";
//template
import NewIcon from "template/NewIcon";
import Pagination from "template/Pagination";
import ProfileImage from "template/ProfileImage";
//util
import * as CD from "global/util/calcDate";

const MyBoard = () => {
  return (
    <div className="PT30 PB80 auto-center loc-board-height">
      <BoardTable title="내 질문" url="question" />
      <BoardTable title="내 답변" url="answer" />
    </div>
  );
};

export default MyBoard;

function BoardTable({ title, url }) {
  /*---------- set 함수 ----------*/
  const [board, setBoard] = useState([]); //테이블 데이터 출력
  const [search, setSearch] = useState(""); //searchBox 검색값
  const [page, setPage] = useState(1); //현재 페이지 위치
  const [pageCnt, setPageCnt] = useState(1); //한 페이지당 레코드 수

  /*---------- TableRow 클릭 이벤트 ----------*/
  let navigate = useNavigate();

  const clickTableRow = (no, e) => {
    // console.log(`key: ${no}`);
    navigate("/Board/Thread/" + no);
  };

  /*---------- useEffect ----------*/
  //게시글 조회
  useEffect(() => {
    // console.log(`params: ${option} / ${search} / ${page}`);
    async function fetchData() {
      await axios
        .get(`http://localhost:4000/setting/profile/myboard/${url}`, {
          params: {
            email: sessionStorage.getItem("loginEmail"),
            search: search,
            page: page,
          },
        })
        .then((res) => {
          // console.log(res.data);
          setBoard(res.data);
        })
        .catch((error) => console.log(error.response));
    }

    fetchData();
  }, [search, page]);

  //페이지 처리
  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`http://localhost:4000/setting/profile/myboard/${url}/page`, {
          params: {
            email: sessionStorage.getItem("loginEmail"),
            search: search,
          },
        })
        .then((res) => {
          //console.log(`res.data.pageCnt: ${res.data[0].pageCnt}`);
          if (res.data[0].pageCnt > 0) {
            setPageCnt(res.data[0].pageCnt);
          }
        })
        .catch((error) => console.log(error.response));
    }

    fetchData();
  }, [search]);

  /*---------- return ----------*/
  return (
    <div className="PT50">
      <div style={{ verticalAlign: "middle" }}>
        <h2 className="left PL10 PB10 title-font">{title}</h2>
        <div className="right PT30">
          <SearchBar
            setSearch={setSearch}
            setPage={setPage}
            bgcolor="#eaeaea"
          />
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          {board.length === 0 ? (
            <div
              className="flex-center"
              style={{
                minHeight: "100px",
              }}
            >
              아직 등록한 {title}이 없습니다.
            </div>
          ) : (
            board.map((row) => (
              <TableBody
                key={row.list_no}
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
                <TableRow
                  height="20px"
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    border: "0",
                  }}
                >
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "ibmLight",
                      fontSize: "18px",
                      borderBottom: "none",
                      paddingLeft: "30px",
                      paddingRight: "30px",
                    }}
                  >
                    {parseInt(row.timediff) < 1440 && <NewIcon />}
                    <span className="left base-font">{row.list_title}</span>
                  </TableCell>
                  <TableCell
                    align="right"
                    rowSpan="2"
                    sx={{ minWidth: "200px" }}
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
                <TableRow
                  height="50px"
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    borderBottom: "1px solid #cccccc",
                  }}
                >
                  <TableCell
                    align="left"
                    sx={{
                      fontFamily: "ibmLight",
                      paddingTop: "0px",
                      paddingLeft: "35px",
                      paddingRight: "35px",
                      vericalAlign: "bottom",
                    }}
                  >
                    {row.list_ctnt
                      .replace(/<[^>]*>?/g, "")
                      .replace(/&nbsp;/gi, "")}
                  </TableCell>
                </TableRow>
              </TableBody>
            ))
          )}
        </Table>
      </TableContainer>
      <Pagination pageCnt={pageCnt} setPage={setPage} />
    </div>
  );
}
