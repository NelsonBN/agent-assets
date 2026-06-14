const fs = require("fs");

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/build.txt", "build ok\n");
console.log("build passed");
