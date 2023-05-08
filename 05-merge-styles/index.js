const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, "styles\\");
const newFilePath = path.join(__dirname, "project-dist\\", "bundle.css");

/** перезапись файла при каждом запуске скрипта */
const clearFile = fs.createWriteStream(newFilePath, { flags: "w" });
clearFile.write('');
clearFile.end()
/** - */

const clearStyles = async function (pathFolder) {
  const clearFile = fs.createWriteStream(pathFolder, { flags: "w" });
  clearFile.write('');
  clearFile.end()
}

const writeFile = async function (fileArr, dist) {
  const ws = fs.createWriteStream(dist, { flags: "a" });
  for (const file of fileArr) {
    const text = await file;
    ws.write(text);
  }
  ws.end();
}

const mergeStyles = async function (src, dist) {

  await clearStyles(dist);

  const files = await fs.promises.readdir(src);
  let fileInner = []

  for (const file of files) {
    const filePath2 = path.join(src, file);

    const stats = await fs.promises.stat(filePath2)

    if (stats.isDirectory()) {
      await mergeStyles(filePath2, dist);
    } else {
      if (path.extname(file) == '.css') {
        fileInner.push(await fs.promises.readFile(filePath2));
      }
    }
  };

  return await writeFile(fileInner, dist)
}

mergeStyles(filePath, newFilePath);