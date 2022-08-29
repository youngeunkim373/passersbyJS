export function calcDate(timediff) {
  // console.log(timediff);
  timediff = parseInt(timediff);
  if (timediff < 60) {
    return `${timediff}분 전`;
  } else if (timediff < 1440) {
    return `${parseInt(timediff / 60)}시간 전`;
  } else if (timediff < 43200) {
    return `${parseInt(timediff / 1440)}일 전`;
  } else if (timediff < 525600) {
    return `${Math.round(timediff / 10950)}달 전`;
  } else {
    return `${Math.round(timediff / 525600)}년 전`;
  }
}
