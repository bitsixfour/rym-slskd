const apiKey = "dccee590-328f-4a16-a350-a728584eafd8";
const urlSlskd = "http://192.168.1.20:5030";
let urlId = "";
const headers = {
  "X-API-KEY": apiKey,
  "Content-Type": "application/json",
};

async function slskdRequest() {
  let request = await fetch(urlSlskd + "/api/v0/searches", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      searchText: requestArtist + " " + requestTitle,
    }),
  });
  let req = await request.json();
  urlId = await req.id();
  return urlId;
}

async function slskdStatus() {
  let status = await fetch(urlSlskd + "/api/v0/searches/" + urlId, {
    method: "GET",
    headers: headers,
  });
  let stringStatus = JSON.parse(status.json());
  return stringStatus.isComplete();
}

function returnArray() {
  return JSON.parse(
    fetch(urlSlskd + "/api/v0/searches/" + urlId + "/responses"),
  );
}

function directoryDownload(str) {
  let newpath = str.split("\\\\").pop();
  return newpath.join("/");
}

async function slskdDownload() {
  while (true) {
    const status = await slskdStatus();
    if (status == true) {
      break;
    }
    await sleep(5000);
  }
  let arr = returnArray();
  let target = 0;
  let user = "";
  for (let i = target; i < arr.length; i++) {
    let obj = arr[i];
    if (
      obj.files[0].filename.includes("live") &&
      (requestArtist + requestTitle).toLowerCase().includes("live") != true
    ) {
      continue;
    }
    for (let l = 0; l < obj.files.length; l++) {
      if (
        obj.filename.toLowercase().endsWith("flac") == true &&
        obj.files[i].isLocked != false
      ) {
        target = i;
        user = obj.username;
        break;
      }
    }
    if (target >= 0) {
      break;
    } // No need to continue the loop if it found a proper qualification
  }
  let downloadStatus = await fetch(
    urlSlskd + "/api/v0/transfers/downloads/" + user,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        filename: directoryDownload(returnArray()[target].files[0].filename),
      }),
    },
  );
}
async function downloadRYMRequest() {
  slskdRequest();
  urlId = slskdRequest();
  slskdDownload();
}
button.addEventListener("click", downloadRYMRequest);
