import React, { useRef, useEffect, useState } from "react";
//애니메이션 라이브러리
import Animated from "animated/lib/targets/react-dom";
import Easing from "animated/lib/Easing";
//MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
//style
import "./style/home.css";

const IndexModal = () => {
  /*---------- 모달 처리(모달화면 클릭하면 모달 꺼짐) ----------*/
  const [display, setDisplay] = useState(sessionStorage.getItem("indexModal"));

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem("indexModal", false);
      setDisplay(sessionStorage.getItem("indexModal"));
    }, 3500);
  }, []);

  const clickModal = () => {
    sessionStorage.setItem("indexModal", false);
    setDisplay(sessionStorage.getItem("indexModal"));
  };

  /*---------- 애니메이션 설정 ----------*/
  const animatedValue = useRef(new Animated.Value(0)).current;

  const moveLeft = () => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.elastic(1),
    }).start();
  };
  // const marginLeft = animatedValue.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, -1400],
  // });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200],
  });

  /*---------- return ----------*/
  return (
    <Modal
      open={display === null ? true : false}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClick={clickModal}
    >
      <Box>
        <div
          className="loc-modal-background bg-img"
          style={{
            backgroundImage: `url("${process.env.PUBLIC_URL}/static/image/door.png")`,
          }}
        >
          <span className="loc-title">길 가는 사람들</span>
          <div className="flex-center">
            <Animated.div
              // style={Object.assign({
              //   opacity: animatedValue,
              //   marginLeft,
              // })}
              style={{
                transform: [{ translateX }],
              }}
              onLoad={moveLeft}
            >
              <img
                id="passersby"
                src={`${process.env.PUBLIC_URL}/static/image/passersby_symbol.png`}
                alt="passersby_symbol"
                className="loc-logo bg-img"
              />
            </Animated.div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default IndexModal;
