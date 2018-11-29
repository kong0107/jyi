"use strict";
const fs = require("fs");
const jsdom = require("jsdom");
const iconv = require("iconv-lite");

const zeroFill = (num, length) => num.toString().padStart(length, "0");
const getParas = elem =>
    Array.from(elem.getElementsByClassName("expreson_content"))
    .map(para => para.textContent.trim())
;

fs.readdirSync("./downloads/").forEach(filename => {
    const match = /^(\d+)\.html$/.exec(filename);
    if(!match) return;
    const number = match[1];
    console.log(number);
    const html = fs.readFileSync(`./downloads/${number}.html`);
    const document = jsdom.jsdom(iconv.decode(html, "Big5").replace(/&nbsp;/g, " "));
    const ths = document.getElementsByTagName("TH");
    const result = {};
    for(let i = 0; i < ths.length; ++i) {
        let match;
        const column = ths[i].textContent.trim();
        const td = ths[i].nextSibling.nextSibling;
        const text = td.textContent.trim();
        switch(column) {
            case "解釋字號":
                result.number = parseInt(/\d+/.exec(text)[0]);
                if(match = /【(.+)】/.exec(text)) result.title = match[1];
                break;
            case "解釋日期":
            case "解釋公布日期":
            case "解釋公布院令":
                match = /(\d+)年(\d+)月(\d+)日/.exec(text);
                result.date = (parseInt(match[1]) + 1911) + '-' + zeroFill(match[2], 2) + '-' + zeroFill(match[3], 2);
                break;
            case "解釋爭點":
                result.issue = text;
                break;
            case "解釋文":
                result.holding = getParas(td).join("\n");
                break;
            case "理由書":
                result.reasoning = getParas(td).join("\n");
                break;
            case "解釋摘要":
            case "理由書附件":
            case "相關法條":
            case "事實":
            case "事實摘要":
            case "意見書":
            case "更正意見書":
            case "相關附件":
            case "聲請書 / 確定終局裁判":
            case "解釋更正院令":
            case "新聞稿、意見書、抄本(含解釋文、理由書、意見書、聲請書及其附件)":
                break;
            default:
                console.error(`JYI ${number} has unknown column name "${column}"`);

        }
    }
    fs.writeFileSync('./json/' + number + '.json', JSON.stringify(result, null, "\t"));
});
