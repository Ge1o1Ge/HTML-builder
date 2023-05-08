const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, "text.txt")

/** перезапись файла при каждом запуске скрипта */
const clearFile = fs.createWriteStream(filePath, {flags: "w"});
clearFile.write('');
clearFile.end()
/** - */

const writeStream = fs.createWriteStream(filePath, {flags: "a"});
console.log("Write your promt:")

process.stdin.setEncoding('utf8');
process.stdin.on("data", (promt) => {
  if (promt.trim().toLowerCase() === 'exit') {
    console.log("Writing is complited!")
    process.stdin.pause()
  } else {
    writeStream.write(promt);
  }
});

process.on("SIGINT", () => {
  console.log("Writing is complited!");
  process.stdin.pause()
})


