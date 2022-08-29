import React from "react";
//MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  color: "#6F30C9",
  bgcolor: "#FFFAFF",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
};

const Alert = ({ alert, setAlert }) => {
  const handleClose = () => setAlert({ ...alert, open: false });

  return (
    <div>
      <Modal
        open={alert.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            <div>
              <ErrorOutlineIcon className="left" sx={{ fontSize: "35px" }} />
              <b className="left">&nbsp;&nbsp;&nbsp;{alert.text}</b>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Alert;
