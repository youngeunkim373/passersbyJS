import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
//MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Divider } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import AddIcon from "@mui/icons-material/Add";
//template
import NewIcon from "template/NewIcon";
import Pagination from "template/Pagination";
import Title from "template/Title";
import ProfileImage from "template/ProfileImage";
import BasicInput from "template/BasicInput";
import Comment from "template/Comment";
import NestedComment from "template/NestedComment";
import Editor from "template/Editor";
import Alert from "template/Alert";
//util
import * as CD from "global/util/calcDate";
import * as AL from "global/util/autoLink";

const NoticeThread = () => {
  /*---------- URL 파라미터 ----------*/
  const { no } = useParams();

  /*---------- set 함수 ----------*/
  //Quill 에디터 설정
  const [quillRef, setQuillRef] = useState(null);
  const [reactQuillRef, setReactQuillRef] = useState(null);

  //공지사항 데이터 출력
  const [notice, setNotice] = useState({
    title: "",
    writer: "",
    ctnt: "",
    timediff: "",
    image: "",
  });
  const { title, writer, ctnt, timediff, image } = notice;

  //댓글 조회
  const [cmnt, setCmnt] = useState([]);
  const [cmntCnt, setCmntCnt] = useState("");

  //댓글 페이지 처리
  const [page, setPage] = useState(1); //현재 페이지 위치
  const [pageCnt, setPageCnt] = useState(1); //한 페이지당 레코드 수

  //댓글입력
  const [cmntInput, setCmntInput] = useState({
    name: "",
    id: "",
    value: "",
  });
  /*---------- Alert창 처리 ----------*/
  const [alert, setAlert] = useState({ open: false, text: "" });

  /*---------- 댓글 조회 ----------*/
  function fetchData02() {
    axios
      .get(`${process.env.REACT_APP_API_ROOT}/notice/comment`, {
        params: {
          no: no,
          page: page,
        },
      })
      .then((res) => {
        setCmnt(res.data.data);
        setCmntCnt(res.data.cmntCnt);
      })
      .catch((error) => console.log(error.response));
  }

  /*---------- 댓글 입력 ----------*/
  const onCmntChange = (e) => {
    e.preventDefault();

    const { name, value, id } = e.target;
    // console.log(e.targe);
    setCmntInput((prev) => ({ ...prev, name: name, value: value, id: id }));
  };

  /*---------- 댓글 저장 ----------*/
  const handleSubmit = (e) => {
    e.preventDefault();

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const email = sessionStorage.getItem("loginEmail");

    if (email === null) {
      setAlert({
        open: true,
        text: "로그인을 먼저 하세요.",
      });
      return;
    }

    //빈칸 방지
    if (cmntInput.value === "") {
      setAlert({
        open: true,
        text: `댓글을 입력해주세요.`,
      });
      return;
    }

    axios
      .post(
        `${process.env.REACT_APP_API_ROOT}/notice/thread/cmnt`,
        JSON.stringify({ no, cmntInput, email }),
        config
      )
      .then((res) => {
        // console.log(res.data);
        setCmntInput({ name: "", value: "", id: "" });
        fetchData02();
      });
  };

  /*---------- useEffect ----------*/
  //공지사항 조회
  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`${process.env.REACT_APP_API_ROOT}/notice/thread/${no}`, {})
        .then((res) => {
          // console.log(res.data[0]);
          setNotice({
            title: res.data[0].list_title,
            writer: res.data[0].list_writer,
            ctnt: res.data[0].list_ctnt,
            timediff: res.data[0].timediff,
            image: res.data[0].user_img,
          });

          var delta = quillRef.current.clipboard.convert(res.data[0].list_ctnt);
          quillRef.current.setContents(delta, "silent");
          quillRef.current.enable(false);
        })
        .catch((error) => console.log(error.response));
    }

    fetchData();
  }, [quillRef]);

  //댓글 조회
  useEffect(() => {
    fetchData02();
  }, [page]);

  //페이지 처리
  useEffect(() => {
    async function fetchData03() {
      await axios
        .get(`${process.env.REACT_APP_API_ROOT}/notice/thread/page/${no}`, {})
        .then((res) => {
          // console.log(res.data[0].pageCnt);
          if (res.data[0].pageCnt > 0) {
            setPageCnt(res.data[0].pageCnt);
          }
        })
        .catch((error) => console.log(error.response));
    }
    fetchData03();
  }, [cmnt]);

  /*---------- return ----------*/
  return (
    <div id="page" className="base-width">
      <Title title="공지사항" />
      <Alert alert={alert} setAlert={setAlert}>
        {alert}
      </Alert>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell align="left" colSpan="2">
                <div className="PT10 base-font">
                  <div className="PL10 title-font">
                    {parseInt(timediff) < 1440 && (
                      <NewIcon marginRight="20px" marginTop="20px" />
                    )}
                    <span className="left PT10">{title}</span>
                  </div>
                  <div className="right PR10">
                    <ProfileImage image={image} />
                  </div>
                  <div className="right PR30 align-right">
                    <span>{writer}</span>
                    <p className="small-font">{CD.calcDate(timediff)}</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                height: "100%",
              }}
            >
              <TableCell align="left">
                <Editor
                  setQuillRef={setQuillRef}
                  setReactQuillRef={setReactQuillRef}
                  display="none"
                  data={AL.autolink(ctnt)}
                  width="100%"
                  readOnly={true}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Divider
          sx={{
            width: "96%",
            margin: "0 auto",
          }}
        />
        <form
          name="cmntForm"
          encType="multi part/form-data"
          onSubmit={handleSubmit}
          method="put"
        >
          <div className="P50">
            <div className="vertical-center">
              <MessageIcon
                sx={{
                  fontSize: "25px",
                  color: "#9000FF",
                  paddingTop: "6px",
                }}
              />
              <span className="PL10">댓글: &nbsp;{cmntCnt}개</span>
            </div>
            <div className="PT30 flex-center">
              <div className="left">
                <ProfileImage image={sessionStorage.getItem("loginImage")} />
              </div>
              <div className="PL30 PR10 width100">
                <BasicInput
                  name="cmnt"
                  lineHeight="50px"
                  placeholder="댓글을 입력하세요."
                  value={cmntInput.value}
                  onChange={onCmntChange}
                />
              </div>
              <button type="submit" className="left PR10 pointer default-btn">
                <AddIcon
                  sx={{
                    fontSize: "35px",
                    color: "#9000FF",
                  }}
                />
              </button>
            </div>
            {cmnt.map((el, idx) =>
              el.nested_cmnt_seq === 0 ? (
                <div key={idx}>
                  <Comment
                    data={el}
                    no={no}
                    fetchData={fetchData02}
                    url="http://localhost:4000/notice/thread/cmnt"
                  />
                  <Divider />
                </div>
              ) : (
                <div key={idx}>
                  <NestedComment data={el} />
                  <Divider />
                </div>
              )
            )}
          </div>
          <div className="PB50">
            <Pagination pageCnt={pageCnt} setPage={setPage} />
          </div>
        </form>
      </TableContainer>
    </div>
  );
};

export default NoticeThread;
