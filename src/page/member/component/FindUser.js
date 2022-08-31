import React, { useState } from "react";
//MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Divider } from "@mui/material";
//template
import Alert from "template/Alert";
//component
import FindEmail from "./FindEmail";
import FindPassword from "./FindPassword";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 400,
  color: "#6F30C9",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
};

const FindUser = ({ popup, setPopup }) => {
  /*---------- set 함수 ----------*/
  const [radio, setRadio] = useState({ email: true, password: false }); //radio 선택 처리
  //로그인 데이터 처리
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const { email, password } = state;

  /*---------- Alert창 처리 ----------*/
  const [alert, setAlert] = useState({ open: false, text: "" });

  /*---------- 창 닫기 처리 ----------*/
  const handleClose = () => setPopup({ ...popup, open: false });

  /*---------- 데이터 입력 처리 ----------*/
  const onTextChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setState({ ...state, [name]: value });
  };

  /*---------- return ----------*/
  return (
    <div>
      <Modal
        open={popup.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Alert alert={alert} setAlert={setAlert}>
            {alert}
          </Alert>
          <div className="align-center base-font">
            <div>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ padding: "0px 0px 20px 115px" }}
                defaultValue="email"
              >
                <FormControlLabel
                  value="email"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#6F30C9",
                        },
                      }}
                    />
                  }
                  label="이메일 찾기"
                  onClick={() => {
                    setRadio({ email: true, password: false });
                  }}
                />
                <FormControlLabel
                  value="password"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#6F30C9",
                        },
                      }}
                    />
                  }
                  label="비밀번호 찾기"
                  onClick={() => {
                    setRadio({ email: false, password: true });
                  }}
                />
                <div
                  style={{
                    marginLeft: "385px",
                    marginTop: "-65px",
                  }}
                >
                  <CloseIcon onClick={handleClose} />
                </div>
              </RadioGroup>
              <Divider />
              {radio.email === true ? (
                <FindEmail
                  email={email}
                  setAlert={setAlert}
                  onTextChange={onTextChange}
                  // display={display}
                  // setDisplay={setDisplay}
                  // clickGoBack={clickGoBack}
                />
              ) : (
                <FindPassword
                  email={email}
                  setAlert={setAlert}
                  onTextChange={onTextChange}
                  // display={display}
                  // setDisplay={setDisplay}
                  // clickGoBack={clickGoBack}
                />
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default FindUser;
