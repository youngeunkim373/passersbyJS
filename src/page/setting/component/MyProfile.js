import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//MUI
import SettingsIcon from "@mui/icons-material/Settings";
//template
import BasicInput from "template/BasicInput";
import SelectBox from "template/SelectBox";
import PushButton from "template/PushButton";
import Alert from "template/Alert";
import ProfileImage from "template/ProfileImage";

/*---------- 고정 값 ----------*/
const sexList = [
  ["선택", " "],
  ["여성", "F"],
  ["남성", "M"],
];
const regionList = [
  ["선택", " "],
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
const KoreanList = {
  F: "여성",
  M: "남성",
  Seoul: "서울특별시",
  Gyeonggi: "경기도",
  Gwangju: "광주광역시",
  Daegu: "대구광역시",
  Daejeon: "대전광역시",
  Busan: "부산광역시",
  Incheon: "인천광역시",
  Ulsan: "울산광역시",
  Sejong: "세종특별자치시",
  Jeju: "제주특별자치도",
  Gangwon: "강원도",
  Gyeongsang: "경상도",
  Jeolla: "전라도",
  Chungcheong: "충청도",
};

const koreanProfile = {
  nicknm: "닉네임",
  age: "연령",
  sex: "성별",
  region: "지역",
};

const MyProfile = () => {
  /*---------- set 함수 ----------*/
  const [sexOption, setSexOption] = useState("");
  const [regionOption, setRegionOption] = useState("");
  const [profile, setProfile] = useState({
    email: "",
    nicknm: "",
    age: "",
    sex: "",
    region: "",
    image: "",
  });
  const { email, nicknm, sex, age, region } = profile;

  const [initNicknm, setInitNicknm] = useState("");

  /*---------- 반응형 css ----------*/
  const matches = useMediaQuery("(max-width:1100px)");

  /*---------- 페이지 이동 / Alert창 처리 ----------*/
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ open: false, text: "" });

  /*---------- 입력창 변경 ----------*/
  const onTextChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    // console.log(`${name}: ${value}`);
    setProfile({ ...profile, [name]: value });
  };

  /*---------- useEffect ----------*/
  // select 태그 처리
  useEffect(() => {
    setProfile((prev) => ({ ...prev, sex: sexOption }));
  }, [sexOption]);

  useEffect(() => {
    setProfile((prev) => ({ ...prev, region: regionOption }));
  }, [regionOption]);

  // 프로필 데이터 출력
  useEffect(() => {
    let email = sessionStorage.getItem("loginEmail");
    //console.log(`email: ${email}`);

    if (email !== null) {
      async function fetchData() {
        await axios
          .get(`http://localhost:4000/setting/profile/myprofile/${email}`, {})
          .then((res) => {
            console.log(res.data[0]);
            setProfile({
              email: res.data[0].email,
              nicknm: res.data[0].nicknm,
              age: res.data[0].age,
              sex: res.data[0].sex,
              region: res.data[0].region,
              image: res.data[0].image,
            });
            setInitNicknm(res.data[0].nicknm);
          })
          .catch((error) => console.log(error.response));
      }

      fetchData();
    } else {
      setAlert({
        open: true,
        text: "로그인을 먼저 하세요.",
      });
    }
  }, []);

  // 프로필 진입 시 로그인 상태 체크
  useEffect(() => {
    if (alert.open === false && alert.text === "로그인을 먼저 하세요.") {
      //홈으로 페이지 이동
      navigate("/signin");
    }
  }, [alert.open]);

  /*---------- return ----------*/
  return (
    <form
      id="profileForm"
      encType="multi part/form-data"
      method="put"
      acceptCharset="UTF-8"
    >
      <div id="myProfile" className="P100">
        <Alert alert={alert} setAlert={setAlert}>
          {alert}
        </Alert>
        <div
          id="firstLine"
          className="auto-center loc-line-height"
          style={{ width: "80%" }}
        >
          <div className="left">
            <ProfileImage image={profile.image} width="110px" height="110px" />
            <input
              className="none"
              id="imageUpload"
              accept="image/*"
              type="file"
              name="image"
              file={profile.image}
            />
            <label htmlFor="imageUpload">
              <SettingsIcon
                name="file"
                style={{
                  width: "25px",
                  height: "25px",
                  padding: "2px",
                  color: "white",
                  backgroundColor: "#cccccc",
                  borderRadius: "50%",
                  position: "relative",
                  zIndex: 2,
                  left: "80px",
                  top: "-40px",
                  cursor: "pointer",
                }}
              />
            </label>
          </div>
          <div className="left PL50 PT10 MT10">
            <p className="title-font auto-center">{initNicknm}</p>
            <p className="norm-font auto-center">{profile.email}</p>
          </div>
        </div>
        <div
          className="auto-center"
          style={{ width: matches ? "300px" : "630px" }}
        >
          <div id="secondLine" className="PT50 loc-line-height">
            <div className="left">
              <label className="loc-label">닉네임</label>
              <BasicInput
                name="nicknm"
                value={profile.nicknm}
                width="300px"
                lineHeight="50px"
                placeholder="닉네임을 입력하세요."
                border="1px solid #cccccc"
                onChange={onTextChange}
              />
            </div>
            <div
              className="left"
              style={{
                paddingLeft: matches ? "0px" : "30px",
                paddingTop: matches ? "20px" : "0px",
              }}
            >
              <label className="loc-label">연령</label>
              <BasicInput
                name="nicknm"
                value={profile.age}
                width="300px"
                lineHeight="50px"
                // placeholder="연령을 입력하세요."
                border="1px solid #cccccc"
                readOnly={true}
              />
            </div>
          </div>
          <div id="thirdLine" className="PT10 loc-line-height">
            <div
              className="left"
              style={{
                paddingTop: matches ? "30px" : "0px",
              }}
            >
              <label className="loc-label">성별</label>
              <div>
                <SelectBox
                  list={sexList}
                  setOption={setSexOption}
                  curVal={KoreanList[profile.sex]}
                  width="300px"
                />
              </div>
            </div>
            <div
              className="left"
              style={{
                paddingLeft: matches ? "0px" : "30px",
                paddingTop: matches ? "30px" : "0px",
              }}
            >
              <label className="loc-label">지역</label>
              <div>
                <SelectBox
                  list={regionList}
                  setOption={setRegionOption}
                  curVal={KoreanList[profile.region]}
                  width="300px"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="align-center"
          style={{
            paddingTop: matches ? "200px" : "30px",
          }}
        >
          <PushButton name="변경" type="submit" />
        </div>
      </div>
    </form>
  );
};

export default MyProfile;
