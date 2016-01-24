var fs = require('fs');
var jsdom = require('jsdom');
var iconv = require('iconv-lite');
var zeroFill = function(num, strlen){
	if(typeof num == "undefined" || !num.toString) num = "0";
	for(num = num.toString(); num.length < strlen; num = "0" + num);
	return num;
}
var getParaList = function(nodeList) {
	var result = [];
	for(var i = 0; i < nodeList.length; ++i) {
		var p = nodeList[i].textContent.trim();
		if(p.length) result.push(p);
	}
	return result;
}
var getHref = function(element) {
	return /href="([^"]+)"/.exec(element.innerHTML)[1];
}

for(var number = 1; number <= 734; ++number) {
//----
console.log("\n#" + number);
var result = {};
var document = jsdom.jsdom(iconv.decode(fs.readFileSync('./downloads/p03_01/' + number + '.html'), 'Big5').replace(/&nbsp;/g, ' '));
var ths = document.getElementsByTagName('TH');
for(var i = 0; i < ths.length; ++i) {
	var match;
	var column = ths[i].textContent.trim();
	var td = ths[i].nextSibling.nextSibling;
	var text = td.textContent.trim();
	
	if(i) process.stdout.write(",");
	process.stdout.write(column);
	
	switch(column) {
		case "解釋字號":
			result.number = parseInt(/\d+/.exec(text)[0]);
			if(match = /(【(.+)】)/.exec(text)) result.title = match[2];
			break;
		case "解釋日期":
		case "解釋公布日期":
			match = /(\d+)年(\d+)月(\d+)日/.exec(text);
			result.date = (parseInt(match[1]) + 1911) + '-' + zeroFill(match[2], 2) + '-' + zeroFill(match[3], 2);
			break;
		case "解釋爭點":
			result.issue = text;
			break;
		case "解釋文":
			result.holding = getParaList(td.childNodes).join('\n');
			break;
		case "理由書":
			result.reasoning = getParaList(td.childNodes).join('\n');
			break;
		case "相關法條":
			result.related_articles = getParaList(td.lastChild.childNodes[1].childNodes);
			break;
		case "事實":
			result.facts = getParaList(td.childNodes).join('\n');
			break;
		case "意見書":
			result.opinions = true;
			break;
		case "相關附件":
			result.related_annexes = true;
			break;
		case "新聞稿、意見書、抄本(含解釋文、理由書、意見書、聲請書及其附件)":
			if(text)
				result.documents = getParaList(td.childNodes);
			break;
		default:
			throw "un-recognized column name";
	}
}
process.stdout.write("\n");
fs.writeFileSync('./json/' + number + '.json', JSON.stringify(result, null, "\t"));
//----
}
