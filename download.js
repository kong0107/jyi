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
for(let number = 1; number <= 781; ++number) {
    queue.push(() => {
        const url = `https://cons.judicial.gov.tw/jcc/zh-tw/jep03/show?expno=${number}`;
        console.log(number);
        return download(url, `./downloads/${number}.html`);
    });

    // 刻意等待
    queue.push(() => new Promise(resolve => setTimeout(resolve, 1000 + 1000 * Math.random())));
}

queue.reduce((acc, cur) => acc.then(cur), Promise.resolve());
