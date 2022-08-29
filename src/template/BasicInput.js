import React from "react";
//style
import "./style/template.css";

const BasicInput = ({
  type = "text",
  placeholder,
  lineHeight,
  width = "100%",
  fontWeight,
  preventSubmitOnEnter = true,
  onChange,
  onKeyPress,
  id,
  name,
  value,
  defaultValue,
  readOnly = false,
}) => {
  const handleKeyPress = (e) => {
    if (preventSubmitOnEnter && e.key === "Enter") e.preventDefault();
    if (typeof onKeyPress === "function") onKeyPress(e.key);
  };

  return (
    <div>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className="BasicInput"
        style={{
          width: `${width}`,
          lineHeight: `${lineHeight}`,
          fontWeight: `${fontWeight}`,
          backgroundColor: readOnly === true && "#EAEAEA",
        }}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        readOnly={readOnly}
      />
    </div>
  );
};

export default BasicInput;
