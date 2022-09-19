import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//template
import BasicInput from "template/BasicInput";
import PushButton from "template/PushButton";
import Title from "template/Title";
import Alert from "template/Alert";
//style
import "./style/member.css";
//context
import AuthContext from "context/AuthProvider";
import FindUser from "./component/FindUser";

const SignIn = () => {
  /*---------- set 함수 ----------*/
  //모달창 처리
  const [alert, setAlert] = useState({ open: false, text: "" });
  const [popup, setPopup] = useState({ open: false });
  //로그인 데이터 처리
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const { email, password } = state;

  /*---------- 페이지 이동 처리 ----------*/
  const navigate = useNavigate();

  /*---------- 로그인 세션 관리 ----------*/
  const { auth, setAuth } = useContext(AuthContext);

  /*---------- 데이터 입력 ----------*/
  const onTextChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setState({ ...state, [name]: value });
  };

  /*---------- 데이터 DB 저장 ----------*/
  const handleSubmit = (e) => {
    e.preventDefault();

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_ROOT}/member/signin`,
        JSON.stringify({ email, password }),
        config
      )
      .then((res) => {
        if (res.data[0].checkLogIn > 0) {
          sessionStorage.setItem("loginEmail", email);
          sessionStorage.setItem("loginNicknm", res.data[0].nicknm);
          sessionStorage.setItem("loginImage", res.data[0].user_img);
          setAuth(sessionStorage.getItem("loginEmail"));

          //홈으로 페이지 이동
          navigate("/");
        } else {
          setAlert({
            open: true,
            text: "아이디와 비밀번호를 확인하세요.",
          });
          return;
        }
      });
  };

  /*---------- return ----------*/
  return (
    <form
      id="page"
      encType="multi part/form-data"
      onSubmit={handleSubmit}
      method="put"
      className="narrow-width"
    >
      <Title title="로그인" />
      <div>
        <Alert alert={alert} setAlert={setAlert}>
          {alert}
        </Alert>
        <FindUser popup={popup} setPopup={setPopup}>
          {popup}
        </FindUser>
      </div>
      <div>
        <label className="loc-label">이메일</label>
        <BasicInput
          name="email"
          value={email}
          width="300px"
          lineHeight="50px"
          placeholder="이메일을 입력하세요."
          border="1px solid #cccccc"
          onChange={onTextChange}
          preventSubmitOnEnter={false}
        />
      </div>
      <div className="PT30">
        <label className="loc-label">비밀번호</label>
        <BasicInput
          type="password"
          name="password"
          value={password}
          width="300px"
          lineHeight="50px"
          placeholder="비밀번호를 입력하세요."
          border="1px solid #cccccc"
          onChange={onTextChange}
          preventSubmitOnEnter={false}
        />
      </div>
      <div
        className="pointer black PT10 PB50 right"
        onClick={() => {
          setPopup({ open: true, text: "" });
        }}
      >
        <span className="base-font">아이디찾기 | 비밀번호 찾기</span>
      </div>
      <div className="align-center PT50">
        <PushButton name="로그인" type="submit" />
      </div>
    </form>
  );
};

export default SignIn;
