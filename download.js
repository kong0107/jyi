"use strict";
const https = require("https");
const fs = require("fs");

function fileExists(filepath, mode = fs.constants.F_OK) {
    return new Promise(resolve => {
        fs.access(filepath, mode, err => resolve(!err));
    });
}

async function download(url, filepath) {
    return new Promise((resolve, reject) => {
        const onError = err => {
            fs.unlink(filepath, delErr => {
                if(delErr) console.error(delErr);
                reject(delErr || err);
            });
        }

        const ws = fs.createWriteStream(filepath);
        ws.on('close', resolve);
        ws.on('error', onError);

        const request = https.get(url, res => {
            switch(res.statusCode) {
                case 200:
                    res.pipe(ws);
                    break;
                case 301:
                case 302:
                    url = 'https://cons.judicial.gov.tw' + res.headers.location;
                    download(url, filepath).then(resolve, reject);
                    break;
                default:
                    onError(res.statusMessage);
            }
        });
        request.on('error', onError);
        request.end();
    });
}

async function main() {
    for(let number = 1; number <= 813; ++number) {
        const filepath = `./downloads/${number}.html`;
        // if(await fileExists(filepath, fs.constants.R_OK)) {
        //     console.log(`jyi#${number} had been downloaded before.`);
        //     continue;
        // }
        try {
            await download(
                `https://cons.judicial.gov.tw/jcc/zh-tw/jep03/show?expno=${number}`,
                filepath
            );
            console.log(`jyi#${number} has been downloaded just now.`);
        }
        catch (err) {
            console.log(`jyi#${number} does not exist.`);
            console.debug(err);
            break;
        }
    }
}

main();
