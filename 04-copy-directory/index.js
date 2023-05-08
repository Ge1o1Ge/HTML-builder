const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, "files\\");
const newFilePath = path.join(__dirname, "files-copy\\");

const clearFolder = async function (pathFolder) {
  const files = await fs.promises.readdir(pathFolder);

  for (const file of files) {
    const filePath2 = path.join(pathFolder, file)
    const stats = await fs.promises.stat(filePath2)

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

copyFolder(filePath, newFilePath);

