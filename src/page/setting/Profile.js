import React from "react";
//MUI
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Divider } from "@mui/material";
//style
import "./style/setting.css";
//template
import Title from "template/Title";
import MyProfile from "./component/MyProfile";
import MyBoard from "./component/MyBoard";

const StyledTab = styled(Tab)({
  "&.Mui-selected": {
    color: "#9000FF",
    fontSize: "20px",
  },
});

const Profile = () => {
  /*---------- 탭 선택 ----------*/
  const [tab, setTab] = React.useState("myProfile");

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  /*---------- return ----------*/
  return (
    <div id="page" className="base-width">
      <Title title="프로필" />
      <div className="BG-white base-radius">
        <Tabs
          value={tab}
          onChange={handleChange}
          className="PL50"
          TabIndicatorProps={{
            style: {
              background: "#9000FF",
            },
          }}
          textColor="secondary"
        >
          <StyledTab
            value="myProfile"
            label="내 프로필"
            sx={{
              fontFamily: "ibmLight",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#101820",
              height: "70px",
            }}
          />
          <StyledTab
            value="qna"
            label="질문/답변"
            sx={{
              fontFamily: "ibmLight",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#101820",
              height: "70px",
              "&:focus": {
                color: "#9000FF",
              },
            }}
          />
        </Tabs>
        <Divider />
        {tab === "myProfile" ? <MyProfile /> : <MyBoard />}
      </div>
    </div>
  );
};

export default Profile;
