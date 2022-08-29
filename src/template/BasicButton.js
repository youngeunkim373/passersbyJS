import React, { useState } from "react";

const BasicButton = ({
  name,
  onClick,
  children,
  type,
  width = "80px",
  height = "30px",
  fontSize = "15px",
}) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <button
      name={name}
      type={type}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="pointer base-font purple BasicButton"
      style={{
        width: width,
        height: height,
        fontSize: fontSize,
      }}
    >
      {children}
    </button>
  );
};

export default BasicButton;
