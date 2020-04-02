const fs = require('fs');

const all = [{}];
fs.readdirSync('./json/').forEach(filename => {
    const match = /^(\d+)\.json$/.exec(filename);
    if(!match) return;
    const i = parseInt(match[1]);

	const jyi = JSON.parse(fs.readFileSync('./json/' + i + '.json').toString());
	all[i] = jyi;
	console.log(i);
});

fs.writeFileSync('./json/all.json', JSON.stringify(all, null, "\t"));
fs.writeFileSync('./json/issues.json', JSON.stringify(all.map(elem => elem.issue), null, "\t"));
fs.writeFileSync('./json/holdings.json',JSON.stringify(all.map(elem => elem.holding), null, "\t"));
