const fs = require('fs');
const c = fs.readFileSync('source_page.html','utf8');
const s = c.indexOf("JSON.parse('");
const e = c.indexOf("'); window['cmsg']", s);
const payload = c.slice(s + "JSON.parse('".length, e);
let bad = [];
for (let i=0;i<payload.length;i++) {
  if (payload[i] === "'") {
    let bs = 0; let j=i-1;
    while (j>=0 && payload[j] === '\\') { bs++; j--; }
    if (bs % 2 === 0) bad.push(i);
  }
}
console.log('unescaped single quotes:', bad.length);
if (bad.length) {
  const i = bad[0];
  console.log('first index', i);
  console.log(payload.slice(Math.max(0,i-120), i+120));
}
