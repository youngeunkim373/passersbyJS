import React from "react";

const ProfileImage = ({ image, width = "55px", height = "55px" }) => {
  return (
    <div
      id="image"
      className="profile-img"
      style={{
        width: width,
        height: height,
        backgroundImage:
          image && image !== "null"
            ? `url("${process.env.PUBLIC_URL}/upload/profileImage/${image}")`
            : `url("${process.env.PUBLIC_URL}/upload/profileImage/basicProfile.png")`,
      }}
    ></div>
  );
};

export default ProfileImage;
