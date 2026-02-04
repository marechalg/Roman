// REGEX
const REG = /\d+([.,]\d+)?/g;

// TITLE
document.title = document.title.replace(REG, match => toRoman(match.replace(',', '.')));