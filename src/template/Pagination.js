import React from "react";
//MUI
import Page from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Pagination = ({ pageCnt, setPage }) => {
  const clickPage = (e, page) => {
    setPage(page);
  };

  return (
    <div className="Pagination">
      <Stack spacing={2}>
        <Page count={pageCnt} color="standard" onChange={clickPage} />
      </Stack>
    </div>
  );
};

export default Pagination;
