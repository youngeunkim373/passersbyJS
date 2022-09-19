import React, { useState } from "react";
import axios from "axios";
//template
import BasicInput from "template/BasicInput";
import PushButton from "template/PushButton";

const FindPassword = ({ email, setAlert, onTextChange }) => {
  /*---------- set 함수 ----------*/
  const [display, setDisplay] = useState({ display: "none", checkEmail: 0 }); //Modal 처리

  /*---------- Modal display 처리 ----------*/
  const clickGoBack = (e) => {
    setDisplay({ display: "none", checkEmail: 0 });
  };
  /*---------- 비밀번호 찾기 ----------*/
  const findPassword = (e) => {
    e.preventDefault();

    if (!email) {
      setAlert({
        open: true,
        text: "이메일을 입력하세요.",
      });
      return;
    }

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    axios
      .get(
        `${process.env.REACT_APP_API_ROOT}/member/signin/findpassword/${email}`,
        {}
      )
      .then((res) => {
        // console.log(res.data[0].checkEmail);
        setDisplay({ display: "block", checkEmail: res.data[0].checkEmail });
      });
  };

  /*---------- return ----------*/
  return (
    <div className="PT30">
      <h2>비밀번호 찾기</h2>
      <div style={{ display: display.display === "block" ? "none" : "block" }}>
        <BasicInput
          name="email"
          value={email}
          width="300px"
          lineHeight="50px"
          placeholder="이메일을 입력하세요."
          border="1px solid #cccccc"
          onChange={onTextChange}
        />
      </div>
      <div className="BG-grey P30" style={{ display: display.display }}>
        {display.checkEmail > 0 ? (
          <span>
            입력하신 이메일({email})로 비밀번호
            <br /> 변경 링크를 전송했습니다. 확인해주세요.
          </span>
        ) : (
          <span>
            입력하신 이메일({email})은
            <br /> 가입이력이 없는 이메일입니다.
          </span>
        )}
      </div>
      <div
        className="PT30 auto-center"
        style={{
          display: display.display === "block" ? "none" : "block",
        }}
      >
        <PushButton name="확인" type="button" onClick={findPassword} />
      </div>
      <div
        className="PT30 auto-center"
        style={{
          display: display.display,
        }}
      >
        <PushButton name="뒤로" type="button" onClick={clickGoBack} />
      </div>
    </div>
  );
};

export default FindPassword;
