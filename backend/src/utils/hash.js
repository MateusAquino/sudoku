// Generate 6 number hash based on string

module.exports = str => {
    str = str.toString()
    str = '0'.repeat(str.length<6?6-str.length:0)+str
    var allowedSymbols = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var hash = Array(6);

    for (let i = 0; i < str.length; i++) // keeps generating hash in 6 chars
        hash[i % 6] = code(hash[i % 6]) ^ code(str[i]);

    for (let i = 0; i < 6; i++) // ensure chars are allowedSymbols
        hash[i] = allowedSymbols[hash[i] % allowedSymbols.length];

    return hash.join('');

    function code(c) {
        return typeof c == 'string' ? c.charCodeAt(0) & 0xFF : c;
    }
}