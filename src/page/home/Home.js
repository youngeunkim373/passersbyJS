import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
//template
import CustomCarousel from "template/CustomCarousel";
//style
import "./style/home.css";
//MUI
import { Divider } from "@mui/material";
//template
import BasicButton from "template/BasicButton";
import PushButton from "template/PushButton";
import Title from "template/Title";
import SelectedBoard from "./component/SelectedBoard";
import Card from "./component/Card";

const banners = [
  <div
    className="carousel-img"
    style={{
      backgroundColor: "#f4f0fa",
      backgroundImage: `url("${process.env.PUBLIC_URL}/static/image/carousel1.png")`,
    }}
  >
    <div>
      <div className="loc-banner-title-font">
        <span className="purple">선택</span>이 힘드신가요?
      </div>
      <p className="loc-banner-ctnt-font">
        인생은 선택의 연속,
        <br />
        선택이 힘들 때는 길가는 사람들에게 물어보세요!
      </p>
      <p className="loc-banner-small-font">
        나는 어디쯤에 속해있을까?
        <br />
        질문에 답변하면서 내 의견이 어디쯤에 속해있는지 알 수 있어요.
        <br />
        통계자료를 통해 보는 내 의견이 궁금하지 않으신가요?
        <br />
        <span className="purple">
          <b>길 가는 사람들</b>
        </span>
        에서 답을 얻고 궁금증도 해결하세요!
      </p>
    </div>
    <div className="right"></div>
  </div>,
  <div
    className="carousel-img"
    style={{
      backgroundColor: "#FFE8F5",
      backgroundImage: `url("${process.env.PUBLIC_URL}/static/image/best.png")`,
    }}
  >
    <div>
      <div className="loc-banner-title-font">
        Is it difficult for you to <span className="red">choose</span>?
      </div>
      <p className="loc-banner-ctnt-font">
        Life is full of choices.
        <br /> When you have difficulty in choosing, ask Passersby!
      </p>
      <p className="loc-banner-small-font">
        Where do I belong?
        <br />
        You can realize where your opinion belongs on Passersby.
        <br />
        Don't you want to know other's opinions with statistical data?
        <br />
        <span className="red">
          <b>Passersby</b>
        </span>
        &nbsp;can answer it!
      </p>
    </div>
    <div className="right"></div>
  </div>,
];

const categories = [
  <Card
    key={1}
    backgroundColor="#c2bae2"
    title="직장/일"
    icon={`${process.env.PUBLIC_URL}/static/image/briefcase.png`}
    line="우당탕탕 직장생활"
  />,
  <Card
    key={2}
    backgroundColor="#f3c1cc"
    title="연애/결혼"
    icon={`${process.env.PUBLIC_URL}/static/image/heart-attack.png`}
    line="연애 나만 힘들어?"
  />,
  <Card
    key={3}
    backgroundColor="#1390d9"
    title="부모/자식"
    icon={`${process.env.PUBLIC_URL}/static/image/family.png`}
    line="가족, 가깝고도 먼...!"
  />,
  <Card
    key={4}
    backgroundColor="#f0c872"
    title="인간관계"
    icon={`${process.env.PUBLIC_URL}/static/image/planet-earth.png`}
    line="우리 같은 행성 사람 맞죠?"
  />,
  <Card
    key={5}
    backgroundColor="#84d9b7"
    title="임신/육아"
    icon={`${process.env.PUBLIC_URL}/static/image/rocking-horse.png`}
    line="성인체력 x 3 = 애들체력"
  />,
  <Card
    key={6}
    backgroundColor="#ec9ca3"
    title="학교생활"
    icon={`${process.env.PUBLIC_URL}/static/image/school.png`}
    line="졸업이라는 출소를..!"
  />,
  <Card
    key={7}
    backgroundColor="#4979cc"
    title="문화생활"
    icon={`${process.env.PUBLIC_URL}/static/image/color-palette.png`}
    line="이거 하려고 돈 번다"
  />,
  <Card
    key={8}
    backgroundColor="#27aa80"
    title="기타"
    icon={`${process.env.PUBLIC_URL}/static/image/guitar.png`}
    line="예, 기타입니다. 쩝"
  />,
];

function bindPara(arr, num) {
  let bind = [];
  for (var i = 0; i < arr.length; i += num) bind.push(arr.slice(i, i + num));
  return bind;
}

const Home = () => {
  /*---------- set 함수 ----------*/
  const [selected, setSelected] = useState("latest"); //게시글 선택

  /*---------- 반응형 css ----------*/
  const matches = useMediaQuery("(max-width:970px)");

  /*---------- 게시글 조회 선택 click event ----------*/
  const clickSelected = (e) => {
    // console.log(e.target.name);
    setSelected(e.target.name);
  };

  /*---------- return ----------*/
  return (
    <div className="auto-center nowrap full-width">
      <div id="carousel">
        <CustomCarousel items={banners} />
      </div>
      <div
        id="membership"
        className="align-center BG-white bg-img P150"
        style={{
          backgroundImage: `url("${process.env.PUBLIC_URL}/static/image/Q&A.png")`,
        }}
      >
        <h1 className="loc-mbrshp-title-font">결정하기가 쉽지 않으신가요?</h1>
        <div className="auto-center loc-divider">
          <Divider />
        </div>
        <h3>
          결정을 내렸다고 생각했지만 막상 행동으로 옮기기가 머뭇거려질 때가
          있죠.
          <br /> 주변사람들과 얘기를 나눠봐도 뾰족한 해답은 없고,
          <br /> 나와 다른 환경에 있는 사람들의 조언은 시원하지 않죠.
          <br />
          <span className="purple">길 가는 사람들</span>과 함께라면 나와 비슷한
          고민을 하는 사람들을 쉽게 찾을 수 있습니다.
        </h3>
        <div className="PT30">
          <Link to="/signup" className="no-underline">
            <PushButton name="시작하기" />
          </Link>
        </div>
      </div>
      <div id="board" className="align-center PT100">
        <div>
          <div>
            <h1 className="loc-board-title-font PB10">
              지금 세상 사람들은 무엇을 궁금해할까요?
            </h1>
            <h3>
              다른 사람들의 관심사에 귀를 기울여보세요.
              <br /> 어쩌면 내가 갖고있던 의문이 해결될 수도 있습니다!
            </h3>
            <div className="auto-center loc-divider">
              <Divider />
            </div>
          </div>
          <div className="PT50">
            <BasicButton
              name="latest"
              width="120px"
              height="40px"
              fontSize="20px"
              onClick={clickSelected}
            >
              최신등록
            </BasicButton>
            <BasicButton
              name="bestView"
              width="120px"
              height="40px"
              fontSize="20px"
              onClick={clickSelected}
            >
              최다조회
            </BasicButton>
            <BasicButton
              name="bestAnswer"
              width="120px"
              height="40px"
              fontSize="20px"
              onClick={clickSelected}
            >
              최다답변
            </BasicButton>
          </div>
        </div>
        <div className="PT30">
          <SelectedBoard selected={selected} />
        </div>
      </div>
      <div id="category" className="align-center P100">
        <Title title="카테고리별 게시글" />
        <div className="auto-center loc-divider">
          <Divider />
        </div>
        <div className="auto-center loc-carousel_width">
          <CustomCarousel
            items={matches ? bindPara(categories, 2) : bindPara(categories, 4)}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
