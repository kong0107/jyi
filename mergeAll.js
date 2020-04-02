const fs = require('fs');
const stringify = obj => JSON.stringify(obj, null, "\t");

const all = [{}];
fs.readdirSync('./json/').forEach(filename => {
    const match = /^(\d+)\.json$/.exec(filename);
    if(!match) return;
    const i = parseInt(match[1]);

	const jyi = JSON.parse(fs.readFileSync('./json/' + i + '.json').toString());
	all[i] = jyi;
	console.log(i);
});

fs.writeFileSync('./json/all.json', stringify(all));
fs.writeFileSync('./json/issues.json', stringify(all.map(elem => elem.issue)));
fs.writeFileSync('./json/holdings.json', stringify(all.map(elem => elem.holding)));
fs.writeFileSync('./json/basic.json', stringify(all.map(elem => Object.assign({}, elem, {reasoning: undefined}))));
