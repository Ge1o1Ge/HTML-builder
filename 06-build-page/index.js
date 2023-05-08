const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, "styles\\");
const newDistPath = path.join(__dirname, "project-dist\\")
const newStylesPath = path.join(newDistPath, "style.css");

fs.promises.mkdir(newDistPath, { recursive: true });

const clearStyles = async function (pathFolder) {
  const clearFile = fs.createWriteStream(pathFolder, { flags: "w" });
  clearFile.write('');
  clearFile.end()
}

const writeFile = async function (fileArr, dist) {
  const ws = fs.createWriteStream(dist, { flags: "a" });
  if (Array.isArray(fileArr)) {
    for (const file of fileArr) {
      const text = await file;
      ws.write(text);
    }
  } else {
    const text = await fileArr;
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

  return await writeFile(fileInner, dist);
}

const clearFolder = async function (pathFolder) {
  const files = await fs.promises.readdir(pathFolder);

  for (const file of files) {
    const filePath2 = path.join(pathFolder, file);
    const stats = await fs.promises.stat(filePath2);

    if (stats.isDirectory()) {
      await clearFolder(filePath2);
      await fs.promises.rmdir(filePath2);
    } else {
      await fs.promises.unlink(filePath2);
    }
  };
}

const copyFolder = async function (src, dist) {

  await fs.promises.mkdir(dist, { recursive: true });
  await clearFolder(dist);

  const files = await fs.promises.readdir(src);
  for (const file of files) {
    const filePath2 = path.join(src, file);
    const newFilePath2 = path.join(dist, file);

    const stats = await fs.promises.stat(filePath2)

    if (stats.isDirectory()) {
      fs.promises.mkdir(newFilePath2, { recursive: true });
      await copyFolder(filePath2, newFilePath2);
    } else {
      await fs.promises.copyFile(filePath2, newFilePath2);
    }
  };
}

const writeHtml = async function (main, htmlObj, dist) {
  const data = await fs.promises.readFile(main, "utf8");
  const newData = data.replace(/{{(\w+)}}/g, (match, blockName) => {
    if (htmlObj[blockName]) {
      return (htmlObj[blockName]);
    } else {
      return match
    }
  });
  return writeFile(newData, dist)
}

const mergeHtml = async function (main, src, dist) {

  await clearStyles(dist);

  const files = await fs.promises.readdir(src);
  let fileInner = {}

  for (const file of files) {
    const filePath2 = path.join(src, file);

    const stats = await fs.promises.stat(filePath2)

    if (stats.isDirectory()) {
      await mergeStyles(filePath2, dist);
    } else {
      if (path.extname(file) == '.html') {
        const fileName = file.split(".")[0];
        fileInner[fileName] = await fs.promises.readFile(filePath2);
      }
    }
  };

  return await writeHtml(main, fileInner, dist)
}

const buildHtml = async function () {
  await clearFolder(newDistPath);
  await copyFolder(path.join(__dirname, "assets\\"), path.join(newDistPath, "assets\\"));
  await mergeStyles(stylesPath, newStylesPath);
  await mergeHtml(path.join(__dirname, "template.html"), path.join(__dirname, "components//"), path.join(newDistPath, "index.html"));
}

buildHtml();