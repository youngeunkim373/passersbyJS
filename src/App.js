import React from "react";
import { Routes, Route, Link } from "react-router-dom";
//page
import Home from "page/home/Home";
import Menu from "page/home/Menu";
//style
import "global/style/font.css";
import "global/style/global.css";
import "global/style/lightTheme.css";
import "react-quill/dist/quill.snow.css";
//page
import Notice from "page/notice/Notice";
import Board from "page/board/Board";
import BoardThread from "page/board/BoardThread";
import SignIn from "page/member/SignIn";
import SignUp from "page/member/SignUp";
import SignOut from "page/member/SignOut";
import Profile from "page/setting/Profile";

function App() {
  /*---------- return ----------*/
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="board" element={<Board />} />
        <Route path="board/thread/:no" element={<BoardThread />} />
        <Route path="notice" element={<Notice />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signout" element={<SignOut />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;

//페이지가 없는 링크를 호출할 때
function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the homepage</Link>
      </p>
    </div>
  );
}
