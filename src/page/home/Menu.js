import React from "react";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
//context
import TextMenu from "./component/TextMenu";
import IconMenu from "./component/IconMenu";
//style
import "./style/home.css";

export default function Menu() {
  /*---------- 반응형 css ----------*/
  const matches = useMediaQuery("(max-width:1250px)");

  /*---------- NavLink css ----------*/
  const activeStyle = ({ isActive }) => ({
    color: isActive ? "#9000ff" : "#101820",
  });

  /*---------- return ----------*/
  return (
    <div className="full-width vertical-center loc-menu-height menu">
      <div className="left vertical-center loc-img-width">
        <Link to="/">
          <img
            src={`${process.env.PUBLIC_URL}/static/image/symbol.png`}
            alt="Home"
            className="left PL10 loc-img-size"
          />
          <span className="left logo-font PT10 MT10">길 가는 사람들</span>
        </Link>
      </div>
      {matches ? (
        <div className="loc-icon-right PR30">
          {["total/right"].map((iconMenu) => (
            <IconMenu
              key={iconMenu}
              menu={iconMenu}
              activeStyle={activeStyle}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="left loc-menu-width align-center">
            {["공지사항/notice", "게시판/board"].map((textMenu) => (
              <TextMenu
                key={textMenu}
                menu={textMenu}
                activeStyle={activeStyle}
              />
            ))}
          </div>
          <div className="right  vertical-center loc-setting-width">
            <div className="left PR30">
              {["로그인/signin", "|/", "회원가입/signup"].map((textMenu) => (
                <TextMenu
                  key={textMenu}
                  menu={textMenu}
                  activeStyle={activeStyle}
                />
              ))}
            </div>
            <div className="right">
              {["settings/top"].map((iconMenu) => (
                <IconMenu
                  key={iconMenu}
                  menu={iconMenu}
                  activeStyle={activeStyle}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
