import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
//MUI
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const colors = [
  "#078261",
  "#f0c872",
  "#1390d9",
  "#27aa80",
  "#e85a9a",
  "#4979cc",
  "#84d9b7",
  "#ed6db1",
  "#9293d2",
  "#b5e4d2",
  "#ec9ca3",
  "#c2bae2",
  "#dff5e7",
  "#f3c1cc",
  "#d4d6eb",
];

const BoardChart = ({ no, reload }) => {
  /*---------- set 함수 ----------*/
  //전체 답변
  const [all, setAll] = useState();
  //성별별 답변
  const [sex, setSex] = useState();
  //연령별 답변
  const [age, setAge] = useState();
  //지역별 답변
  const [region, setRegion] = useState();
  //차트데이터 답변 개수
  const [chartLength, setChartLength] = useState(0);
  //내 답변
  const [myAnswer, setMyAnswer] = useState(
    "아직 답변을 등록하지 않은 질문입니다."
  );

  /*---------- useEffect ----------*/
  useEffect(() => {
    //차트 데이터 array
    const allArr = [["answer", "count"]];
    const sexArr = [["", "여성", "남성"]];
    const ageArr = [
      [
        "",
        "10세 미만",
        "10대",
        "20대",
        "30대",
        "40대",
        "50대",
        "60대",
        "70대",
        "80대",
        "90대",
        "100세 이상",
      ],
    ];
    const regionArr = [
      [
        "",
        "서울특별시",
        "경기도",
        "광주광역시",
        "대구광역시",
        "대전광역시",
        "부산광역시",
        "인천광역시",
        "울산광역시",
        "세종특별자치시",
        "제주특별자치도",
        "강원도",
        "경상도",
        "전라도",
        "충청도",
      ],
    ];

    async function fetchData() {
      await axios
        .get(
          `${
            process.env.REACT_APP_API_ROOT
          }/board/stats/${no}/${sessionStorage.getItem("loginEmail")}`,
          {}
        )
        .then((res) => {
          let tot_ans_sel_cnt = 0;

          if (res.data.myAnswer !== null) {
            setMyAnswer(res.data.myAnswer);
          }

          for (var el of res.data.data) {
            tot_ans_sel_cnt += Number(el.ans_sel_cnt);

            allArr.push([String(el.ans_ctnt), Number(el.ans_sel_cnt)]);
            sexArr.push([
              String(el.ans_ctnt),
              Number(el.user_sex_f),
              Number(el.user_sex_m),
            ]);
            ageArr.push([
              String(el.ans_ctnt),
              Number(el.user_age_0),
              Number(el.user_age_10),
              Number(el.user_age_20),
              Number(el.user_age_30),
              Number(el.user_age_40),
              Number(el.user_age_50),
              Number(el.user_age_60),
              Number(el.user_age_70),
              Number(el.user_age_80),
              Number(el.user_age_90),
              Number(el.user_age_100),
            ]);
            regionArr.push([
              String(el.ans_ctnt),
              Number(el.user_region_seoul),
              Number(el.user_region_gyeonggi),
              Number(el.user_region_gwangju),
              Number(el.user_region_daegu),
              Number(el.user_region_daejeon),
              Number(el.user_region_busan),
              Number(el.user_region_incheon),
              Number(el.user_region_ulsan),
              Number(el.user_region_sejong),
              Number(el.user_region_jeju),
              Number(el.user_region_gangwon),
              Number(el.user_region_gyeongsang),
              Number(el.user_region_jeolla),
              Number(el.user_region_chungcheong),
            ]);
          }
          //});
          setAll(allArr);
          setSex(sexArr);
          setAge(ageArr);
          setRegion(regionArr);
          setChartLength(tot_ans_sel_cnt);
        })
        .catch((error) => console.log(error.response));
    }
    fetchData();
  }, [no, reload]);

  return (
    <Accordion
      sx={{
        boxShadow: "none",
        borderBottom: "1px solid #cccccc",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ fontFamily: "ibmRegular" }}>통계 보기</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {chartLength > 0 ? (
          <div>
            <p className="title-font">내 답변</p>
            <div className="BG-grey P30 align-center title-font">
              {myAnswer}
            </div>
            <br />
            <p className="title-font">통계자료</p>
            <div>
              <Chart
                name="all"
                chartType="PieChart"
                data={all}
                options={{
                  title: "전체 답변",
                  is3D: true,
                  sliceVisibilityThreshold: 0,
                  colors: colors,
                }}
                width="100%"
                height="400px"
              />
              <Chart
                name="성별"
                chartType="BarChart"
                data={sex}
                options={{
                  title: "성별별 답변",
                  chartArea: { width: "50%" },
                  isStacked: true,
                  colors: colors,
                }}
                width="100%"
                height="400px"
              />
              <Chart
                name="연령"
                chartType="BarChart"
                data={age}
                options={{
                  title: "연령별 답변",
                  chartArea: { width: "50%" },
                  isStacked: true,
                  colors: colors,
                }}
                width="100%"
                height="400px"
              />
              <Chart
                name="지역"
                chartType="BarChart"
                data={region}
                options={{
                  title: "지역별 답변",
                  chartArea: { width: "50%" },
                  isStacked: true,
                  colors: colors,
                }}
                width="100%"
                height="400px"
              />
            </div>
          </div>
        ) : (
          <div className="BG-grey P30 align-center">
            아직 답변이 등록되지 않았습니다.
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default BoardChart;
