import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
//MUI
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
//style
import "../style/home.css";
//context
import AuthContext from "context/AuthProvider";

const Icons = ({ text }) => {
  switch (text) {
    case "notice":
      return <AnnouncementIcon />;
    case "board":
      return <AssignmentIcon />;
    case "signin":
      return <LoginIcon />;
    case "signup":
      return <AccountCircleIcon />;
    case "signout":
      return <LogoutIcon />;
    case "profile":
      return <AccountCircleIcon />;
    case "settings":
      return <SettingsApplicationsIcon />;
    default:
      return <CancelIcon />;
  }
};

const IconMenu = ({ menu, activeStyle }) => {
  const textMenu = menu.split("/")[0];
  const anchor = menu.split("/")[1];

  /*---------- set 함수 ----------*/
  const [state, setState] = useState({
    top: false,
    right: false,
  });

  /*---------- 로그인 세션 관리 ----------*/
  const { auth, setAuth } = useContext(AuthContext);

  /*---------- drawer ----------*/
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  /*---------- list ----------*/
  const list = (anchor, drawerMenu) => (
    <Box
      key={drawerMenu}
      sx={{ width: anchor === "top" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {drawerMenu.map((text) => (
          <NavLink
            key={text}
            to={"/" + text.split("/")[1]}
            style={activeStyle}
            className="no-underline"
          >
            <ListItem button disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icons text={text.split("/")[1]} />
                </ListItemIcon>
                <div className="loc-setting-font">{text.split("/")[0]}</div>
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Box>
  );

  /*---------- return ----------*/
  return (
    <React.Fragment key={textMenu}>
      <Button
        onClick={toggleDrawer(anchor, true, textMenu)}
        style={{
          color: "#9000ff",
        }}
      >
        {textMenu === "settings" ? (
          <SettingsIcon />
        ) : textMenu === "total" ? (
          <MenuIcon />
        ) : (
          <span>{textMenu}</span>
        )}
      </Button>
      <div>
        <Drawer
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          // anchor={"top"}
          // open={state["top"]}
          // onClose={toggleDrawer("top", false)}
          PaperProps={{
            sx: {
              top: "50px",
              boxShadow: "none",
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: "transparent",
            },
          }}
        >
          {textMenu === "settings"
            ? list("top", ["프로필/profile"])
            : // list("top", ["프로필/profile", "설정/settings"])
            textMenu === "total"
            ? list("right", [
                auth === null ? "로그인/signin" : "로그아웃/signout",
                "회원가입/signup",
                "공지사항/notice",
                "게시판/board",
                "프로필/profile",
              ])
            : list("top", [])}
        </Drawer>
      </div>
    </React.Fragment>
  );
};

export default IconMenu;
