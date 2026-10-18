const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// We want to replace font-cinzel or font-playball with font-sinhala
// if the line contains Sinhala characters (\u0D80-\u0DFF).
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (/[\u0D80-\u0DFF]/.test(lines[i])) {
        // Line has Sinhala characters
        if (lines[i].includes('font-cinzel')) {
            lines[i] = lines[i].replace(/font-cinzel/g, 'font-sinhala');
        }
        if (lines[i].includes('font-playball')) {
            lines[i] = lines[i].replace(/font-playball/g, 'font-sinhala');
        }
    }
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Done replacement.');
