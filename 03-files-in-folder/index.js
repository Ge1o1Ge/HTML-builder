const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, "secret-folder\\")

fs.readdir(filePath, (err, files) => {
  
  if (err) {
    console.log(err);
    return;
  }

  files.forEach(file => {
    const filePath2 = path.join(filePath, file)
    fs.stat(filePath2, (err, stats) => {
      
      if (err) {
        console.log(err);
        return;
      }

      if (!stats.isDirectory()) {
        console.log(file.split(".")[0], "->" , path.extname(file).slice(1), "->", stats.size/1024, "kb");
        return;
      }
    })
  });
})


