export function autolink(text) {
  //   console.log(text);
  var regURL = new RegExp(
    "(http|https|ftp|telnet|news|irc)://([-/.a-zA-Z0-9_~#%$?&=:200-377()]+)",
    "gi"
  );
  var regEmail = new RegExp(
    "([xA1-xFEa-z0-9_-]+@[xA1-xFEa-z0-9-]+.[a-z0-9-]+)",
    "gi"
  );

  text = text
    .replace(
      regURL,
      //no referer 보안이슈 조사해보기
      `<a href="$1://$2" target="_blank"> 
            $1://$2
          </a>`
    )
    .replace(regEmail, "<a href='mailto:$1'>$1</a>");

  return <p dangerouslySetInnerHTML={{ __html: text }}></p>;
}
