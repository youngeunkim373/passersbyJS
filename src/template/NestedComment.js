import React from "react";
import ProfileImage from "template/ProfileImage";
//util
import * as CD from "global/util/calcDate";
import * as AL from "global/util/autoLink";

const NestedComment = ({ data }) => {
  return (
    <div className="PL80 PT30 PB30">
      <span className="left PT10 PR10">└</span>
      <div className="left PR10">
        <ProfileImage image={data.user_img} />
      </div>
      <div className="PL80">
        <div className="base-font">
          <span>{data.user_nicknm}</span>
          <span className="PL10 small-font">{CD.calcDate(data.timediff)}</span>
        </div>
        <div className="norm-font loc-cmnt">{AL.autolink(data.cmnt_ctnt)}</div>
      </div>
    </div>
  );
};

export default NestedComment;
