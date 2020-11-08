// Returns the index where two strings diverge

module.exports = (a, b) => {
    if (a.length < b.length) [a, b] = [b, a];
    return [...a].findIndex((chr, i) => chr !== b[i]);
}