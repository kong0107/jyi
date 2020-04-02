"use strict";
const fs = require("fs");
const jsdom = require("jsdom");

const zeroFill = (num, length) => num.toString().padStart(length, "0");

fs.readdirSync("./downloads/").forEach(filename => {
    let match = /^(\d+)\.html$/.exec(filename);
    if(!match) return;
    const number = match[1];
    console.log(number);
    const html = fs.readFileSync(`./downloads/${number}.html`);
    const items = jsdom.jsdom(html).querySelectorAll("#ExplainTable > div > .item");
    if(!items.length) {
        console.error("HTML parsing error");
        return;
    }

    const result = {};
    for(let i = 0; i < items.length; ++i) {
        const column = items[i].firstElementChild.textContent.trim();
        const contentElem = items[i].lastElementChild;
        const text = contentElem.textContent.trim();
        switch(column) {
            case "解釋字號":
                result.number = parseInt(/\d+/.exec(text)[0]);
                if(match = /【(.+)】/.exec(text)) result.title = match[1];
                break;
            case "解釋公布院令":
                match = /(\d+)\s+年\s+(\d+)\s+月\s+(\d+)\s+日/.exec(text);
                result.date = (parseInt(match[1]) + 1911) + '-' + zeroFill(match[2], 2) + '-' + zeroFill(match[3], 2);
                break;
            case "解釋爭點":
                result.issue = text;
                break;
            case "解釋文":
            case "理由書":
                const paras = [];
                const paraElems = contentElem.querySelectorAll("pre");
                for(let i = 0; i < paraElems.length; ++i) 
                    paras.push(
                        paraElems[i].textContent.trimEnd()
                        .replace(/\s*\n\s+/g, '')
                        .replace(/\n/g, ' ')
                    );

                // 把末段的大法官名單拿掉
                let lastPara = paras.pop();
                const pos = lastPara.search(/ 大法官會議\s?主\s?席/);
                if(pos !== -1) lastPara = lastPara.substr(0, pos);
                paras.push(lastPara);

                result[column === "解釋文" ? "holding" : "reasoning"] = paras.join("\n");
                break;
            case "意見書、抄本等文件":
            case "相關法令":
            case "相關文件":
            case "事實摘要": // #650 起
            case "意見書": // #737 起
            case "聲請書/ 確定終局裁判": // #737 起
            case "解釋摘要": // #748 起
            case "理由書附件": // #749 起偶爾
            case "解釋更正院令": // #738, #751 only
            case "更正意見書": // #738, #751 only
                break;
            default:
                console.error(`JYI ${number} has unknown column name "${column}"`);

        }
    }

    fs.writeFileSync('./json/' + number + '.json', JSON.stringify(result, null, "\t"));
});

console.log("Parsing finished.");
