import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
//MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateIcon from "@mui/icons-material/Create";
//template
import NewIcon from "template/NewIcon";
import SelectBox from "template/SelectBox";
import Pagination from "template/Pagination";
import PushButton from "template/PushButton";
import SearchBar from "template/SearchBar";
import Title from "template/Title";
import ProfileImage from "template/ProfileImage";
import Alert from "template/Alert";
//util
import * as CD from "global/util/calcDate";
//style
import "./style/board.css";

const list = [
  ["최신순", "reg_date DESC, reg_time DESC"],
  ["조회수순", "list_view_cnt DESC"],
  ["답변수순", "list_ans_cnt DESC"],
];

export default function Board(props) {
  /*---------- set 함수 ----------*/
  const [board, setBoard] = useState([]); //게시판에 데이터 출력
  const [option, setOption] = useState(list[0][1]); //select 변경값
  const [search, setSearch] = useState(""); //searchBox 검색값
  const [page, setPage] = useState(1); //현재 페이지 위치
  const [pageCnt, setPageCnt] = useState(1); //한 페이지당 레코드 수

  /*---------- Alert창 처리 ----------*/
  const [alert, setAlert] = useState({ open: false, text: "" });

  /*---------- NavLink style ----------*/
  const activeStyle = ({ isActive }) => ({
    color: isActive ? "#9000FF" : "#101820",
    textDecoration: "none",
  });

  /*---------- TableRow 클릭 이벤트 ----------*/
  let navigate = useNavigate();

  const clickTableRow = (no, e) => {
    navigate("/Board/Thread/" + no);
  };

  /*---------- useEffect ----------*/
  //게시판 리스트 조회 & 페이지 처리
  useEffect(() => {
    // console.log(`params: ${option} / ${search} / ${page}`);
    async function fetchData01() {
      await axios
        .get("http://localhost:4000/board/data", {
          params: {
            option: option,
            search: search,
            page: page,
          },
        })
        .then((res) => {
          setBoard(res.data);
        })
        .catch((error) => console.log(error.response));
    }

    fetchData01();

    async function fetchData02() {
      await axios
        .get("http://localhost:4000/board/page", {
          params: {
            search: search,
          },
        })
        .then((res) => {
          // console.log(`pageCnt: ${res.data[0].pageCnt}`);
          setPageCnt(res.data[0].pageCnt);
        })
        .catch((error) => console.log(error.response));
    }

    fetchData02();
  }, [option, search, page]);

  /*---------- return ----------*/
  return (
    <div id="page" className="base-width">
      <Title title="게시판" />
      <br />
      <Alert alert={alert} setAlert={setAlert}>
        {alert}
      </Alert>
      <div>
        <div className="left PL30 PT10">
          <SelectBox list={list} setOption={setOption} curVal={list[0][0]} />
        </div>
        <div className="right">
          <SearchBar setSearch={setSearch} setPage={setPage} />
        </div>
      </div>
      <br />
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          {board.map((row) => (
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
                    borderBottom: "none",
                  }}
                >
                  <div className="PL30 PR30">
                    {parseInt(row.timediff) < 1440 && <NewIcon />}
                    <span className="left base-font">{row.list_title}</span>
                  </div>
                </TableCell>
                <TableCell align="right" rowSpan="2" sx={{ minWidth: "200px" }}>
                  <div className="right">
                    <ProfileImage image={row.user_img} />
                  </div>
                  <div className="PR10 right base-font">
                    <span>{row.list_writer}</span>
                    <p className="small-font">{CD.calcDate(row.timediff)}</p>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow height="50px">
                <TableCell
                  align="left"
                  sx={{
                    paddingTop: "0px",
                  }}
                >
                  <div className="norm-font PL30 PR30">
                    {row.list_ctnt
                      .replace(/<[^>]*>?/g, "")
                      .replace(/&nbsp;/gi, "")}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>
      </TableContainer>
      <div className="PT30">
        <Pagination pageCnt={pageCnt} setPage={setPage} />
      </div>
      <NavLink
        to="/board/write"
        onClick={(e) => {
          if (!sessionStorage.getItem("loginEmail")) {
            setAlert({
              open: true,
              text: "로그인을 먼저 하고 이용해주세요.",
            });
            e.preventDefault();
          }
        }}
        className="loc-push-btn"
        style={activeStyle}
      >
        <PushButton name="글쓰기" icon={<CreateIcon />} type="button" />
      </NavLink>
    </div>
  );
}
