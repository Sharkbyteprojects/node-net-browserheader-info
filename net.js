const formatDate = require("./form.js");
const fs = require("fs");
const path = require("path");
function asb(data, status, ...headers) {
  const d = new Date();
  let sh = "";
  for (let header of headers) {
    sh += `\n${header}`;
  }
  const answer = `HTTP/1.1 ${status}\nDate: ${formatDate(
    d,
    "ddd, d MMM y HH:mm:ss"
  )} GMT\nConnection: keep-alive\nContent-Length: ${
    data.split("").length
  }${sh}\n\n${data}`;
  return answer;
}
function server(data, conn) {
  console.log("\n\n" + data);
  let head = ["GitHub: https://github.com/Sharkbyteprojects"];
  if (data.split("\n")[0].includes("/setcoo")) {
    if (!data.includes("visited=true")) {
      head.push("Set-Cookie: visited=true;SameSite=strict");
    } else {
      head.push("Set-Cookie: visited=false;SameSite=strict");
    }
  }
  fs.readFile(
    path.resolve(__dirname, "htmltemplate.html"),
    "utf8",
    (err, datax) => {
      if (err) {
        conn.end(
          asb(
            `OOOPS, WE CAN'T FIND THE PAGE!!!`,
            "404 NotFound",
            "Content-Type: text/plain; encoding=utf-8"
          )
        );
      } else {
        let xxx = [];
        let firs=true;
        for (let xx of data.split("\n")) {
          let y = xx.split(":");
          if(firs){
              y=xx.split(" H");
          }
          const z = y[0];
          y[0] = `<strong class="t">${z}</strong>`;
          xx = y.join(":");
          if(firs){
            xx=y.join(" H");
            firs=false;
          }
          xxx.push(xx);
        }
        const xxz = xxx.join("\n");
        const page=datax.replace("${myheaderz}", xxz);
        conn.end(
          asb(
            page.replace("${base}", Buffer.from(page.replace('<p><a href="data:text/html;base64,${base}">Link to this Headerdata (FOR STORE)</a></p>', "")).toString("base64")),
            "200 OK",
            "Content-Type: text/html; encoding=utf-8",
            "Server: Sharkbyteprojects raw Server",
            ...head
          )
        );
      }
    }
  );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const net = require("net");
const port = process.env.PORT || 8080;
net
  .createServer((conn) => {
    conn.on("readable", () => {
      const datax = conn.read();
      if (datax != null) {
        const data = datax.toString();
        server(data, conn);
      }
    });
  })
  .listen(port, () => {
    console.log("Listen on " + port.toString());
  });
