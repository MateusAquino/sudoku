const hash = require("./hash")

test('it should always return a 6-length hash', () => {
    expect(hash('').length).toBe(6)
    expect(hash('test').length).toBe(6)
    expect(hash('testing more').length).toBe(6)
})

test('it should always return same hash for any string', () => {
    expect(hash("This is a random string for testing")).toBe('4XLU6Q')
    expect(hash("This is a random string for another testing")).not.toBe('4XLU6Q')
})

test('it should hash numbers and dates', () => {
    let expectedHash = 'LB5001';
    expect(hash(1321009871011)).toBe(expectedHash)
    expect(hash('1321009871011'.toString())).toBe(expectedHash)
    expect(hash(new Date('11/11/11 11:11:11:11 GMT-0'))).toBe(expectedHash)
})