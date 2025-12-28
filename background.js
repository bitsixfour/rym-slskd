let requestTitle = document.querySelector("a.sametitle").textContent;
console.log(requestTitle);
let requestArtist = document.querySelector("a.artist").textContent;
requestArtist = requestArtist.replace(/\[.*?\]/g, "").trim();
console.log(requestArtist);
