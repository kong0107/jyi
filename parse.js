"use strict";
const fs = require("fs");
const { JSDOM } = require("jsdom");
const zeroFill = (num, length) => num.toString().padStart(length, "0");

for(let jyi = 1; jyi <= 813; ++jyi) {
    console.log(jyi);
    const html = fs.readFileSync(`./downloads/${jyi}.html`);
    const domWindow = (new JSDOM(html)).window;
    const items = domWindow.document.querySelectorAll(".lawList > ul > li:last-child");
    if(!items.length) return console.error("HTML parsing error");

    const result = {};
    items.forEach(item => {
        let match;
        const text = item.textContent.trim();
        switch(item.title) {
            case "解釋字號":
                result.number = parseInt(/\d+/.exec(text)[0]);
                if(match = /【(.+)】/.exec(text)) result.title = match[1];
                break;
            case "解釋公布院令":
                match = /(\d+)年(\d+)月(\d+)日/.exec(text);
                result.date = (parseInt(match[1]) + 1911) + '-' + zeroFill(match[2], 2) + '-' + zeroFill(match[3], 2);
                break;
            case "解釋爭點":
                result.issue = text;
                break;
            case "解釋文":
            case "理由書":
                const paras = Array.from(item.querySelectorAll("pre")).map(para =>
                    para.textContent.trimEnd()
                    .replace(/\s*\n\s+/g, '')
                    .replace(/\n/g, ' ')
                );

                // 把末段的大法官名單拿掉
                const pos = paras.findIndex(text => text.startsWith("大法官會議"));
                if(pos !== -1) paras.splice(pos);
                result[item.title === "解釋文" ? "holding" : "reasoning"] = paras.join("\n");
                break;
            case "意見書、抄本等文件":
            case "相關法令":
            case "相關文件":
            case "事實摘要": // #650 起
            case "其他公開之卷內文書": // #698 起
            case "意見書": // #737 起
            case "聲請書/ 確定終局裁判": // #737 起
            case "解釋摘要": // #748 起
            case "理由書附件": // #749 起偶爾
            case "解釋更正院令": // #738, #751 only
            case "更正意見書": // #738, #751 only
                break;
            default:
                console.error(`unknown column name "${item.title}"`);

        }
    });

    domWindow.close(); // release memory
    fs.writeFileSync(`./json/${jyi}.json`, JSON.stringify(result, null, "\t"));
}

console.log("Parsing finished.");
