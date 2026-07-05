const fs = require("fs");
const csv = require("csv-parser");
 
function readCSV(path) {
    return new Promise((resolve, reject) => {
 
        const results = [];
 
        fs.createReadStream(path)
            .pipe(csv())
            .on("data", (row) => results.push(row))
            .on("end", () => resolve(results))
            .on("error", reject);
 
    });
}
 
module.exports = readCSV;