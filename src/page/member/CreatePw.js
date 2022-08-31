import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
//template
import BasicInput from "template/BasicInput";
import PushButton from "template/PushButton";
import Title from "template/Title";
import Alert from "template/Alert";

const CreatePw = () => {
  /*---------- 페이지 이동 / Alert창 처리 ----------*/
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ open: false, text: "" });

  /*---------- 데이터 출력 ----------*/
  const { email } = useParams(); //URL 파라미터
  // console.log(`email: ${email}`);
  const [state, setState] = useState({ password: "", confirm: "" });

  const { password, confirm } = state;
  const koreanState = {
    password: "비밀번호",
    confirm: "비밀번호 확인",
  };

  /*---------- DB 저장 ----------*/
  const onTextChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(`password: ${password} / confirm: ${confirm}`);

    if (password !== confirm) {
      setAlert({
        open: true,
        text: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    //빈칸 방지
    for (var el in state) {
      if (state[el] === "") {
        setAlert({
          open: true,
          text: `${koreanState[el]}란을 입력해주세요.`,
        });
        return;
      }
    }

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    axios
      .post(
        "http://localhost:4000/member/createpw",
        JSON.stringify({ email, password }),
        config
      )
      .then((res) => {
        //로그인으로 페이지 이동
        navigate("/signin");
      })
      .catch((error) => console.log(error.response));
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
      <Title title="비밀번호 변경" />
      <div>
        <Alert alert={alert} setAlert={setAlert}>
          {alert}
        </Alert>
        <div className="PT30">
          <label className="loc-label">이메일</label>
          <BasicInput
            id={1}
            name="email"
            defaultValue={email}
            width="300px"
            lineHeight="50px"
            placeholder="이메일을 입력하세요."
            border="1px solid #cccccc"
            readOnly={true}
          />
        </div>
        <div className="PT30">
          <label className="loc-label">비밀번호</label>
          <BasicInput
            type="password"
            id={2}
            name="password"
            value={password}
            lineHeight="50px"
            placeholder="비밀번호를 입력하세요."
            border="1px solid #cccccc"
            onChange={onTextChange}
          />
        </div>
        <div className="PT30">
          <label className="loc-label">비밀번호 확인</label>
          <BasicInput
            type="password"
            id={3}
            name="confirm"
            value={confirm}
            lineHeight="50px"
            placeholder="비밀번호를 한 번 더 입력하세요."
            border="1px solid #cccccc"
            onChange={onTextChange}
          />
        </div>
      </div>
      <div className="align-center PT50">
        <PushButton name="변경" type="submit" />
      </div>
    </form>
  );
};

export default CreatePw;
