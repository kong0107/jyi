/// 輸出時均加上換行，以利觀察。
var fs = require('fs');

var all = '[{}';
var dates = [''];
var titles = [''];
var issues = [''];
var holdings = [''];

//for(var i = 1; i <= 735; ++i) {
fs.readdirSync('./json/').forEach(filename => {
    const match = /^(\d+)\.json$/.exec(filename);
    if(!match) return;
    const i = parseInt(match[1]);

	var jyi = fs.readFileSync('./json/' + i + '.json').toString();
	all += ',\n' + jyi;
	jyi = JSON.parse(jyi);
	dates[i] = jyi.date;
	issues[i] = jyi.issue;
	holdings[i] = jyi.holding;
	titles[i] = jyi.title ? jyi.title : '';
	console.log(i);
});

all    += ']\n';
dates   = JSON.stringify(dates   ).replace(/,/g,  ',\n') + '\n';
titles  = JSON.stringify(titles  ).replace(/,/g,  ',\n') + '\n';
issues  = JSON.stringify(issues  ).replace(/",/g, '",\n') + '\n';
holdings= JSON.stringify(holdings).replace(/,/g,  ',\n') + '\n';

fs.writeFileSync('./json/all.json',     all);
fs.writeFileSync('./json/dates.json',   dates);
fs.writeFileSync('./json/titles.json',  titles);
fs.writeFileSync('./json/issues.json',  issues);
fs.writeFileSync('./json/holdings.json',holdings);

fs.writeFileSync('./xss/all.js',     'jyi_all='     + all);
fs.writeFileSync('./xss/dates.js',   'jyi_dates='   + dates);
fs.writeFileSync('./xss/titles.js',  'jyi_titles='  + titles);
fs.writeFileSync('./xss/issues.js',  'jyi_issues='  + issues);
fs.writeFileSync('./xss/holdings.js','jyi_holdings='+ holdings);
