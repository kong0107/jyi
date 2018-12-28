"use strict";
const https = require("https");
const fs = require("fs");

const download = (url, filename) => {
    const ws = fs.createWriteStream(filename);
    return new Promise((resolve, reject) =>
        https.get(url, rs => {
            rs.pipe(ws);
            rs.on("end", resolve);
            rs.on("error", reject)
        })
    )
};

const queue = [];
for(let number = 772; number <= 773; ++number) {
    queue.push(() => {
        const url = (number <= 736)
            ? `https://www.judicial.gov.tw/constitutionalcourt/p03_01.asp?expno=${number}`
            : `https://www.judicial.gov.tw/constitutionalcourt/p03_01_1.asp?expno=${number}`
        ;
        console.log(number);
        return download(url, `./downloads/${number}.html`);
    });
    
    // 刻意等待
    queue.push(() => new Promise(resolve => setTimeout(resolve, 1000 + 1000 * Math.random())));
}

queue.reduce((acc, cur) => acc.then(cur), Promise.resolve());
