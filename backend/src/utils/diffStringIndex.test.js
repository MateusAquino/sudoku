const diffStringsIndex = require("./diffStringsIndex")

const unique  = "2..3.....8.4.62..3.138..2......2.39.5.7...621.32..6....2...914.6.125.8.9.....1..2"
const changed = "2..3.....2.2.62..3.138..2......2.39.5.7...621.32..6....2...914.6.125.8.9.....1..2"

test('it should find first index where difference occured', () => {
    expect(diffStringsIndex(unique, changed)).toBe(9)
})

test('it should return -1 on equal strings', () => {
    expect(diffStringsIndex(unique, unique)).toBe(-1)
})