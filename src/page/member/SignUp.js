import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//template
import BasicInput from "template/BasicInput";
import BasicButton from "template/BasicButton";
import PushButton from "template/PushButton";
import SelectBox from "template/SelectBox";
import Title from "template/Title";
import Alert from "template/Alert";
//MUI
import TextField from "@mui/material/TextField";

/*---------- SelectBox ----------*/
//성별
const sexList = [
  ["선택", ""],
  ["여성", "F"],
  ["남성", "M"],
];

//지역
const regionList = [
  ["선택", ""],
  ["서울특별시", "Seoul"],
  ["경기도", "Gyeonggi"],
  ["광주광역시", "Gwangju"],
  ["대구광역시", "Daegu"],
  ["대전광역시", "Daejeon"],
  ["부산광역시", "Busan"],
  ["인천광역시", "Incheon"],
  ["울산광역시", "Ulsan"],
  ["세종특별자치시", "Sejong"],
  ["제주특별자치도", "Jeju"],
  ["강원도", "Gangwon"],
  ["경상도", "Gyeongsang"],
  ["전라도", "Jeolla"],
  ["충청도", "Chungcheong"],
];

const SignUp = () => {
  /*---------- set 함수 ----------*/
  const [sexOption, setSexOption] = useState(""); //select(성별)
  const [regionOption, setRegionOption] = useState(""); //select(지역)
  //validation check
  const [display, setDisplay] = useState({
    correctEmail: "none", //이메일 형식 체크
    duplicationEmail: "none", //이메일 중복 체크
    verifyInput: "none", //본인인증 번호 입력란
    incorrectNumber: "none", //본인인증 번호 일치 여부
    verifyComplete: "none", //본인인증 완료 체크
  });
  const [number, setNumber] = useState(null); //서버에서 본인인증 번호 받기
  const [verifyNumber, setVerifyNumber] = useState(""); //본인인증 번호 입력
  //회원정보 입력
  const [state, setState] = useState({
    email: "",
    password: "",
    confirm: "",
    nickname: "",
    age: "",
    sex: "",
    region: "",
  });
  const { email, password, confirm, nickname, sex, age, region } = state;
  const koreanState = {
    email: "이메일",
    password: "비밀번호",
    confirm: "비밀번호 확인",
    nickname: "닉네임",
    sex: "성별",
    age: "연령",
    region: "지역",
  };

  /*---------- 페이지 이동 / Alert창 처리 ----------*/
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ open: false, text: "" });

  /*---------- 이메일 본인인증 ----------*/
  const clickSendMail = (e) => {
    e.preventDefault();

    //이메일 형식 체크
    const email = state.email;
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (!emailRegex.test(state.email)) {
      setDisplay({
        correctEmail: "block",
        duplicationEmail: "none",
        verifyInput: "none",
        incorrectNumber: "none",
        verifyComplete: "none",
      });
      return;
    } else {
      setDisplay({
        correctEmail: "none",
        duplicationEmail: "none",
        verifyInput: "block",
        incorrectNumber: "none",
        verifyComplete: "none",
      });
    }

    //이메일 보내기
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    axios
      .post(
        "http://localhost:4000/member/signup/sendEmail",
        JSON.stringify({ email }), //key랑 value가 이름이 같으면 그냥 이렇게 쓰면 됨 & 문자열 변환 필수
        config
      )
      .then((res) => {
        //이메일 중복방지
        // console.log(res.data.checkDup);
        if (res.data.checkDup !== undefined && res.data.checkDup > 0) {
          setDisplay({
            correctEmail: "none",
            duplicationEmail: "block",
            verifyInput: "none",
            incorrectNumber: "none",
            verifyComplete: "none",
          });
          return;
        }
        //본인인증 메일전송 확인
        setDisplay({
          correctEmail: "none",
          duplicationEmail: "none",
          verifyInput: "block",
          incorrectNumber: "none",
          verifyComplete: "none",
        });
        //본인인증 번호 받기
        setNumber(res.data.number);
      });
  };

  /*---------- 인증번호 입력 처리 ----------*/
  const onNumberChange = (e) => {
    e.preventDefault();
    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
    setVerifyNumber(onlyNumber);
  };

  /*---------- 인증번호 입력 처리 ----------*/
  const onPressEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (String(e.target.value) === String(number)) {
        setDisplay({
          correctEmail: "none",
          duplicationEmail: "none",
          verifyInput: "none",
          incorrectNumber: "none",
          verifyComplete: "block",
        });
      } else {
        setDisplay({
          correctEmail: "none",
          duplicationEmail: "none",
          verifyInput: "block",
          incorrectNumber: "block",
          verifyComplete: "none",
        });
      }
    }
  };

  /*---------- 데이터 DB 저장 ----------*/
  //form 엔터 submit 방지
  // useEffect(() => {
  //   document.getElementById("signupForm").addEventListener(
  //     "keydown",
  //     function (e) {
  //       if (e.key === "Enter") {
  //         e.preventDefault();
  //       }
  //     },
  //     true
  //   );
  // }, []);

  /*---------- 데이터 입력 처리 ----------*/
  const onTextChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setState({ ...state, [name]: value });
  };

  /*---------- 회원정보 DB 저장 ----------*/
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(
    //   `email: ${email} / password: ${password} / confirm: ${confirm} / nickname: ${nickname} /
    //    sex: ${sex} / age: ${age} / region: ${region}`
    // );

    if (display.verifyComplete !== "block") {
      setAlert({
        open: true,
        text: "본인인증을 완료하세요.",
      });
      return;
    }

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
        "http://localhost:4000/member/signup",
        JSON.stringify({ email, password, nickname, sex, age, region }),
        config
      )
      .then((res) => {
        //console.log(res.data);

        //닉네임 중복 여부 받기
        if (res.data[0].NickNmDup > 0) {
          setAlert({
            open: true,
            text: "이미 존재하는 닉네임입니다.",
          });
          return;
        }

        //로그인으로 페이지 이동
        navigate("/signin");
      })
      .catch((error) => console.log(error.response));
  };

  /*---------- useEffect ----------*/
  useEffect(() => {
    setState((prev) => ({ ...prev, sex: sexOption }));
  }, [sexOption]);

  useEffect(() => {
    setState((prev) => ({ ...prev, region: regionOption }));
  }, [regionOption]);

  /*---------- return ----------*/
  return (
    <form
      id="page"
      encType="multi part/form-data"
      onSubmit={handleSubmit}
      method="put"
    >
      <Title title="회원가입" />
      <div className="auto-center narrow-width">
        <Alert alert={alert} setAlert={setAlert}>
          {alert}
        </Alert>
        <div className="left PT30">
          <label className="loc-label">이메일</label>
          <BasicInput
            id={1}
            name="email"
            value={email}
            width="300px"
            lineHeight="50px"
            placeholder="이메일을 입력하세요."
            border="1px solid #cccccc"
            onChange={onTextChange}
          />
          <p className="loc-ptag red" style={{ display: display.correctEmail }}>
            올바른 이메일 형식이 아닙니다.
          </p>
          <p
            className="loc-ptag red"
            style={{ display: display.duplicationEmail }}
          >
            가입한 이력이 있는 이메일입니다.
          </p>
          <p
            className="loc-ptag blue"
            style={{ display: display.verifyComplete }}
          >
            본인인증이 완료되었습니다.
          </p>
          <div
            className="PT30"
            style={{
              width: "300px",
              display: display.verifyInput,
            }}
          >
            <TextField
              name="verify"
              label="인증번호"
              color="warning"
              size="small"
              placeholder="본인인증 메일이 전송되었습니다."
              focused
              fullWidth
              type="text"
              value={verifyNumber}
              onChange={onNumberChange}
              onKeyDown={onPressEnter}
            />
          </div>
          <p
            className="loc-ptag red"
            style={{ display: display.incorrectNumber }}
          >
            본인인증 번호가 일치하지 않습니다.
          </p>
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
          <div className="PT30">
            <label className="loc-label">닉네임</label>
            <BasicInput
              id={4}
              name="nickname"
              value={nickname}
              lineHeight="50px"
              placeholder="닉네임을 입력하세요."
              border="1px solid #cccccc"
              onChange={onTextChange}
            />
          </div>
          <div className="PT30">
            <label className="loc-label">연령</label>
            <BasicInput
              type="text"
              id={6}
              name="age"
              value={age}
              lineHeight="50px"
              placeholder="나이를 입력하세요."
              border="1px solid #cccccc"
              onChange={onTextChange}
            />
          </div>
          <div
            className="left PT30"
            style={{
              width: "100px",
            }}
          >
            <label className="loc-label">성별</label>
            <div style={{ marginLeft: "5px" }}>
              <SelectBox
                list={sexList}
                setOption={setSexOption}
                curVal={sexList[0][0]}
              />
            </div>
          </div>
          <div
            className="left PT30"
            style={{
              width: "150px",
              paddingLeft: "50px",
            }}
          >
            <label className="loc-label">지역</label>
            <div style={{ marginLeft: "5px" }}>
              <SelectBox
                list={regionList}
                setOption={setRegionOption}
                curVal={regionList[0][0]}
              />
            </div>
          </div>
          <div className="align-center PT100 MT50 MB100">
            <PushButton
              name="회원가입"
              position="relative"
              type="submit"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
      <div
        className="left"
        style={{
          paddingTop: "67px",
        }}
      >
        <BasicButton type="button" onClick={clickSendMail}>
          본인인증
        </BasicButton>
      </div>
    </form>
  );
};

export default SignUp;
