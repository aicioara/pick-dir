const {h, render, Text} = require('ink');
const UI = require('import-jsx')('./UI.jsx')
const exit = render(h(UI), process.stderr);
