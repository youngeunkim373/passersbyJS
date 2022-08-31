import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";

const CustomCarousel = ({ items, display = "block" }) => {
  // console.log("items", items);
  return (
    <Carousel
      navButtonsAlwaysVisible={true}
      indicatorContainerProps={{
        style: {
          display: display,
        },
      }}
    >
      {items.map((item, idx) => (
        <Paper
          key={idx}
          style={{
            height: "340px",
            backgroundColor: "transparent",
          }}
        >
          {item}
        </Paper>
      ))}
    </Carousel>
  );
};

export default CustomCarousel;
