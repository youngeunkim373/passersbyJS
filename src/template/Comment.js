import React, { useState } from "react";
import ProfileImage from "template/ProfileImage";
import axios from "axios";
//MUI
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
//template
import BasicButton from "template/BasicButton";
import BasicInput from "template/BasicInput";
import Alert from "template/Alert";
//util
import * as CD from "global/util/calcDate";
import * as AL from "global/util/autoLink";
//style
import "./style/template.css";

const Comment = ({ no, data, fetchData, url }) => {
  /*---------- set 함수 ----------*/
  //댓글입력
  const [cmntInput, setCmntInput] = useState({
    name: "",
    id: "",
    value: "",
  });

  /*---------- Alert창 처리 ----------*/
  const [alert, setAlert] = useState({ open: false, text: "" });

  /*---------- 댓글 입력 ----------*/
  const onCmntChange = (e) => {
    e.preventDefault();
    const { name, value, id } = e.target;
    // console.log(e.target);
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
      .post(url, JSON.stringify({ no, cmntInput, email }), config)
      .then((res) => {
        // console.log(res.data);
        setCmntInput({ name: "", value: "", id: "" });
        fetchData();
      });
  };

  /*---------- return ----------*/
  return (
    <div className="PT30">
      <Alert alert={alert} setAlert={setAlert}>
        {alert}
      </Alert>
      <div className="left PR10">
        <ProfileImage image={data.user_img} />
      </div>
      <div className="PL80">
        <div className="base-font">
          <span>{data.user_nicknm}</span>
          <span className="PL10 small-font">{CD.calcDate(data.timediff)}</span>
        </div>
        <div className="norm-font loc-cmnt">{AL.autolink(data.cmnt_ctnt)}</div>
      </div>
      <Accordion sx={{ boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="PL50">
            <BasicButton type="button">답글달기</BasicButton>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="PL50 flex-center">
            <div>
              <ProfileImage image={sessionStorage.getItem("loginImage")} />
            </div>
            <div className="left PL30 loc-cmnt-width">
              <BasicInput
                name="nestedCmnt"
                id={data.cmnt_seq}
                lineHeight="50px"
                placeholder="댓글을 입력하세요."
                value={cmntInput.value}
                onChange={onCmntChange}
              />
            </div>
            <button
              type="button"
              className="left PR10 pointer default-btn"
              onClick={handleSubmit}
            >
              <AddIcon
                sx={{
                  fontSize: "35px",
                  color: "#9000FF",
                }}
              />
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Comment;
