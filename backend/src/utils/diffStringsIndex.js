// Returns the index where two strings diverge

module.exports = (a, b) => {
    return [...a].findIndex((chr, i) => chr !== b[i]);
}