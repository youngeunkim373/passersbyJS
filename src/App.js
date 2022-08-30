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
import BoardWrite from "page/board/BoardWrite";
//global
import Layout from "global/component/Layout";
import NoticeThread from "page/notice/NoticeThread";

function App() {
  /*---------- return ----------*/
  return (
    <div>
      <Menu />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="notice"
          element={
            <Layout>
              <Notice />
            </Layout>
          }
        />
        <Route
          path="notice/thread/:no"
          element={
            <Layout>
              <NoticeThread />
            </Layout>
          }
        />
        <Route
          path="board"
          element={
            <Layout>
              <Board />
            </Layout>
          }
        />
        <Route
          path="board/thread/:no"
          element={
            <Layout>
              <BoardThread />
            </Layout>
          }
        />
        <Route
          path="board/write"
          element={
            <Layout>
              <BoardWrite />
            </Layout>
          }
        />
        <Route
          path="signin"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />
        <Route
          path="signup"
          element={
            <Layout>
              <SignUp />
            </Layout>
          }
        />
        <Route
          path="signout"
          element={
            <Layout>
              <SignOut />
            </Layout>
          }
        />
        <Route
          path="profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
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
