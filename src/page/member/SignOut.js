import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//context
import AuthContext from "context/AuthProvider";

const SignOut = () => {
  /*---------- 페이지 이동 ----------*/
  const navigate = useNavigate();

  /*---------- 로그인 세션 관리 ----------*/
  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    sessionStorage.removeItem("loginEmail");
    sessionStorage.removeItem("loginNicknm");
    sessionStorage.removeItem("loginImage");
    setAuth(sessionStorage.getItem("loginEmail"));

    //홈으로 페이지 이동
    navigate("/");
  }, [navigate, setAuth]);

  return <div>로그아웃</div>;
};

export default SignOut;
