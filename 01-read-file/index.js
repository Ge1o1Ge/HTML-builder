const fs = require('fs');
const path = require('path');

/** console.log(__dirname) */
const rs = fs.createReadStream(path.join(__dirname, 'text.txt'), {encoding: "utf8"});

rs.on('data', (text) => {
  console.log(text);
});
