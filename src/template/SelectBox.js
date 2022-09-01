import React, { useState } from "react";
import styled from "@emotion/styled";
//style
import "./style/template.css";

const SelectBox = ({ list = {}, setOption, width, curVal }) => {
  /*---------- set 함수 ----------*/
  const [currentValue, setCurrentValue] = useState(curVal);
  const [isShowOptions, setShowOptions] = useState(false);

  /*---------- option 클릭 이벤트 ----------*/
  const changeOption = (e) => {
    // console.log(e.target);
    setCurrentValue(e.target.innerText);
    setOption(e.target.id);
  };

  /*---------- return ----------*/
  return (
    <div
      onClick={() => setShowOptions((prev) => !prev)}
      className="SelectBox-div"
      style={{ width: width }}
    >
      {currentValue === undefined ? (
        <label className="SelectBox-label">{curVal}</label>
      ) : (
        <label className="SelectBox-label">{currentValue}</label>
      )}
      <ul
        className="SelectBox-ul"
        style={{
          height: list.length >= 5 ? "180px" : 33 * list.length,
          overflow: list.length >= 5 ? "auto" : "hidden",
          display: isShowOptions === false ? "none" : "block",
        }}
      >
        {list.map((item) => (
          <li
            key={item[0]}
            id={item[1]}
            onClick={changeOption}
            className="SelectBox-li"
          >
            {item[0]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectBox;
