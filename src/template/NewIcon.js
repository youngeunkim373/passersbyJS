import React from "react";
//style
import "./style/template.css";

const NewIcon = ({ marginRight = "10px", marginTop = "5px" }) => {
  return (
    <div
      className="left NewIcon-div"
      style={{
        marginRight: marginRight,
        marginTop: marginTop,
      }}
    >
      <span className="NewIcon-span">N</span>
    </div>
  );
};

export default NewIcon;
