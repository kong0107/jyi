const fs = require('fs');
const stringify = obj => JSON.stringify(obj, null, "\t");

const all = [{}];
for(let i = 1; i <= 813; ++i) {
	const jyi = JSON.parse(fs.readFileSync(`./json/${i}.json`).toString());
	all[i] = jyi;
	if(!(i % 64)) process.stdout.write('.');
}
process.stdout.write('\n');

fs.writeFileSync('./json/all.json', stringify(all));
fs.writeFileSync('./json/issues.json', stringify(all.map(elem => elem.issue)));
fs.writeFileSync('./json/holdings.json', stringify(all.map(elem => elem.holding)));
fs.writeFileSync('./json/basic.json', stringify(all.map(elem => Object.assign({}, elem, {reasoning: undefined}))));
