const {h, render, Text} = require('ink');
const UI = require('./UI.jsx')
// Clear Console
console.error('\x1Bc');
const exit = render(h(UI), process.stderr);
