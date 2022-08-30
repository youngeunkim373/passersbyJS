import React from "react";
//MUI
import Box from "@mui/material/Box";
//component
import Footer from "./Footer";

const Layout = ({ children }) => {
  window.scrollTo(0, 0);

  return (
    <div id="wrapper">
      <div id="content">
        <div>
          <Box>{children}</Box>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
