const {h, render, Text} = require('ink');
const UI = require('import-jsx')('./UI.jsx')
// Clear Console
// console.error('\x1Bc');
const exit = render(h(UI), process.stderr);
