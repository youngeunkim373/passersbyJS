import React from "react";
//MUI
import Button from "@mui/material/Button";
//style
import "./style/template.css";

const PushButton = ({ name, icon, type, onClick }) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      sx={{
        fontFamily: "ibmMedium",
        fontSize: "16px",
        backgroundColor: "#6F30C9",
        border: "0",
        padding: "0",
        borderRadius: "15px",
        cursor: "pointer",
        outlineOffset: "4px",

        "&:hover": {
          transform: "translateY(5px)",
          transition: "transform 0.25s cubic-bezier(.3, .7, .4, 1.5)",
          backgroundColor: "#6F30C9",
        },
      }}
    >
      <span
        style={{
          minWidth: "130px",
          display: "block",
          borderRadius: "15px",
          lineHeight: "50px",
          fontSize: "1.2rem",
          color: "white",
          backgroundColor: "#9000FF",
          transform: "translateY(-8px)",
          transition: "transform 0.4s cubic-bezier(.3, .7, .4, 1)",
        }}
      >
        <div
          className="left"
          style={{
            marginTop: "0.3rem",
            marginLeft: "1rem",
            width: "0.3rem",
            display: icon === undefined ? "none" : "block",
          }}
        >
          {icon}
        </div>
        {name}
      </span>
    </Button>
  );
};

export default PushButton;
