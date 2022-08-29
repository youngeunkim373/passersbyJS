import React from "react";
//CSS
import "global/style/font.css";

const Title = ({ title, color = "#101820" }) => {
  return (
    <div className="align-center">
      <h1
        style={{
          fontFamily: "ibmRegular",
          color: color
        }}
      >
        {title}
      </h1>
    </div>
  );
};

export default Title;
