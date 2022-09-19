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
//util
import * as CD from "global/util/calcDate";

const SelectedBoard = ({ selected }) => {
  /*---------- set 함수 ----------*/
  const [board, setBoard] = useState([]);

  /*---------- TableRow 클릭 이벤트 ----------*/
  let navigate = useNavigate();

  const clickTableRow = (no, e) => {
    navigate("/Board/Thread/" + no);
  };

  /*---------- useEffect ----------*/
  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`${process.env.REACT_APP_API_ROOT}/home/${selected}`, {})
        .then((res) => {
          // console.log(res.data);
          setBoard(res.data);
        })
        .catch((error) => console.log(error.response));
    }

    fetchData();
  }, [selected]);

  /*---------- return ----------*/
  return (
    <div className="auto-center base-width">
      <Title
        title={
          selected === "latest"
            ? "최신등록 게시글"
            : selected === "bestView"
            ? "최다조회 게시글"
            : "최다답변 게시글"
        }
      />
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
                  className="norm-font"
                  sx={{
                    paddingTop: "0px",
                  }}
                >
                  <div className="norm-font PL30 text-break">
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
    </div>
  );
};

export default SelectedBoard;
