const fs = require("fs");
const path = require("path");
const { finished } = require("stream");

const csvFilePath = path.join(__dirname, "dummy_data.csv");

const startId = 1;
const endId = 1000000;

const header = ["userId"];
const data = [];

for (let userId = startId; userId <= endId; userId++) {
  data.push([`U${userId.toString().padStart(10, "0")}`]);
}

const writeStream = fs.createWriteStream(csvFilePath);

writeStream.write(header.join(",") + "\n");
data.forEach((row) => {
  writeStream.write(row.join(",") + "\n");
});

writeStream.end();

finished(writeStream, () => {
  console.log("CSVファイルが作成されました。");
});
