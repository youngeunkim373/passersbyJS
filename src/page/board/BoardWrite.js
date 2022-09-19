import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useBeforeunload } from "react-beforeunload";
//template
import Editor from "template/Editor";
import BasicInput from "template/BasicInput";
import BasicButton from "template/BasicButton";
import Title from "template/Title";
import PushButton from "template/PushButton";
import Alert from "template/Alert";

const BoardWrite = () => {
  /*---------- set 함수 ----------*/
  const [state, setState] = useState("");
  const [quillRef, setQuillRef] = useState(null);
  const [reactQuillRef, setReactQuillRef] = useState(null);

  const [list, setList] = useState({
    title: "",
    writer: sessionStorage.getItem("loginNicknm"),
    content: "",
    email: sessionStorage.getItem("loginEmail"),
  });
  const { title, writer, content } = list;
  const koreanList = {
    title: "제목",
    content: "내용",
  };

  /*---------- 페이지 이동 & Alert창 처리 ----------*/
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ open: false, text: "" });

  /*---------- N지선다/찬반 버튼 설정 ----------*/
  const handleClickMultiple = (e) => {
    e.preventDefault();
    // var range = quillRef.current.getSelection();
    // let position = range ? range.index : 0;
    // quillRef.current.insertText(position, "<div>Hello, World!</div>");
    // quillRef.insertEmbed(
    //   position,
    //   "blockquote",
    //   "https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3",
    //   "user"
    // );

    if (state === "YNDiv") {
      setAlert({
        open: true,
        text: "이미 찬반 버튼을 추가하였습니다.",
      });
      return;
    }

    var html = `<div className="MultipleDiv"><em>선택지를 입력하세요.</em></div><br/>`;
    var delta = quillRef.current.clipboard.convert(html);
    quillRef.current.updateContents(delta, "api");

    setState("MultipleDiv");
  };

  const handleClickYN = (e) => {
    e.preventDefault();

    if (state === "YNDiv") {
      setAlert({
        open: true,
        text: "찬반 버튼은 하나만 추가할 수 있습니다.",
      });
      return;
    } else if (state === "MultipleDiv") {
      setAlert({
        open: true,
        text: "이미 N지선다 버튼을 추가하였습니다.",
      });
      return;
    }

    var html = `<div className="MultipleDiv"><em>&nbsp;&nbsp;찬성&nbsp;&nbsp;</em><strong>vs</strong><em>&nbsp;&nbsp;반대&nbsp;&nbsp;</em></div><br/>`;
    var delta = quillRef.current.clipboard.convert(html);
    quillRef.current.updateContents(delta, "silent");

    setState("YNDiv");
  };

  /*---------- 입력 ----------*/
  const onTextChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setList({ ...list, [name]: value });
  };

  const onEditorChange = (html) => {
    // console.log({ editorHtml: html });
    setList({ ...list, content: html });
  };

  /*---------- 데이터 DB 저장 ----------*/
  const handleSubmit = (e) => {
    console.log("handleSubmit");
    e.preventDefault();

    // var formData = new FormData();
    // formData.append("title", list.title);
    // formData.append("writer", list.writer);
    // formData.append(
    //   "content",
    //   list.content.replaceAll("/upload/temporary/", "/upload/board/")
    // );
    // formData.append("email", list.email);

    // const input = document.getElementById("imageUpload");
    // const files = Object.values(input.files);
    // Object.values(files).forEach((file) => {
    //   formData.append("file", file);
    // });

    // for (let value of formData.values()) {
    //   console.log(value);
    // }
    // return;

    const title = list.title;
    const writer = list.writer;
    const content = list.content.replaceAll(
      "/upload/temporary/",
      "/upload/board/"
    );
    const email = list.email;

    //빈칸 방지
    for (var el in list) {
      if (list[el] === "") {
        setAlert({
          open: true,
          text: `${koreanList[el]}란을 입력해주세요.`,
        });
        return;
      }
    }

    // const config = {
    //   headers: { "Content-Type": "multipart/form-data" },
    //   withCredentials: true,
    // };
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_ROOT}/board/write`,
        JSON.stringify({ title, writer, content, email }),
        config
      )

      .then((res) => {
        // console.log(res.data);
        //게시판으로 페이지 이동
        navigate("/Board");
      });
  };

  /*---------- 페이지 이동 감지 ----------*/
  const deleteImage = () => {
    const email = sessionStorage.getItem("loginEmail");

    axios
      .get(
        `${process.env.REACT_APP_API_ROOT}/board/write/deleteimage/${email}`,
        {}
      )
      .then((res) => {
        // console.log(res.data);
      });
  };

  // 페이지 이동, 뒤로가기
  let location = useLocation();

  useEffect(() => {
    return () => {
      deleteImage();
    };
  }, [location]);

  //새로고침
  useBeforeunload((e) => {
    console.log("before unload");
    deleteImage();
    e.preventDefault();
  });

  /*---------- return ----------*/
  return (
    <form
      id="page"
      encType="multi part/form-data"
      onSubmit={handleSubmit}
      method="put"
      className="loc-write-width"
    >
      <Title title="게시판" />
      <BasicInput
        placeholder="제목을 입력하세요."
        lineHeight={3}
        fontWeight="bold"
        name="title"
        value={title}
        onChange={onTextChange}
      />
      <div>
        <Alert alert={alert} setAlert={setAlert}>
          {alert}
        </Alert>
        <div className="PT10 PB10">
          <BasicButton onClick={handleClickMultiple}>N지선다</BasicButton>
          <BasicButton onClick={handleClickYN}>찬반</BasicButton>
        </div>
        <Editor
          setQuillRef={setQuillRef}
          setReactQuillRef={setReactQuillRef}
          onEditorChange={onEditorChange}
        />
        <div className="align-center PT30">
          <PushButton type="submit" name="등록하기" />
        </div>
      </div>
    </form>
  );
};

export default BoardWrite;
