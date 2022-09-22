import React from "react";
//MUI
import { Box } from "@mui/system";

const Card = ({ backgroundColor, title, icon, line }) => {
  return (
    <Box
      className="left loc-category-box align-center MT50"
      sx={{ backgroundColor: backgroundColor }}
      component="div"
      onClick={() => {
        alert("아직 미개발 상태입니다. 조금만 기다려주세요!");
      }}
    >
      <div className="line-6">
        <h2 className="PB10">{title}</h2>
        <img src={icon} alt="category" width="100px" className="PB10" />
        <p className="font-normal PT10">{line}</p>
      </div>
    </Box>
  );
};

export default Card;
