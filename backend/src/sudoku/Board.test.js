const { TestScheduler } = require('jest')
const Board = require('./Board')

const unique      = "2..3.....8.4.62..3.138..2......2.39.5.7...621.32..6....2...914.6.125.8.9.....1..2"
const solved      = "276314958854962713913875264468127395597438621132596487325789146641253879789641532"
const invalid     = "...456...123...789...456...123...789...456...123...789...456...123...789...456..."
const unsolvable  = "7..3.....8.4.62..3.138..2......2.39.5.7...621.32..6....2...914.6.125.8.9.....1..2"

test('it should generate empty sudoku', () => {
    expect(new Board().toString()).toBe(".".repeat(81))
})

test('it should use existing sudoku string', () => {
    expect(new Board(invalid).toString()).toBe(invalid)
})

test('it should solve valid unique board', () => {
    expect(new Board(unique).solve()).toBe(solved)
})

test('it should be able to solve "statically" when string is passed', () => {
    expect(new Board(invalid).solve(unique)).toBe(solved)
    expect(new Board(unique).solve(NaN)).toBe(false)
})

test('it should return false for solving invalid board', () => {
    expect(new Board(invalid).solve()).toBeFalsy()
})

test('it should get random hint for valid board', () => {
    expect(new Board(unique).toString()  .split('.').length-1).toBe(47)
    expect(new Board(unique).solveNext(1).split('.').length-1).toBe(46)
})

test('it should return false getting hint for valid board that is unsolvable', () => {
    expect(new Board(unsolvable).solveNext(1)).toBeFalsy()
})

test('it should return itself getting hint for solved board', () => {
    expect(new Board(solved).solve()).toBe(solved)
})

test('it should return true if solved and false if it is not', () => {
    expect(new Board(solved).isSolvedSudoku()).toBeTruthy()
    expect(new Board(unique).isSolvedSudoku()).toBeFalsy()
})

test('it should return false getting hint from solved board', () => {
    expect(new Board(solved).solveNext(1)).toBeFalsy()
})

test('it should replace a cell', () => {
    expect(new Board(unique).replaceCell(0, 7)).toBe(unsolvable)
})

test('it should return correct values for possible cols/rows/blocks', () => {
    const board = new Board()
    expect(board.isPossibleNumber(0, 7, unique)).toEqual(['row', 'col', 'block']) // ok
    expect(board.isPossibleNumber(1, 1, unique)).toEqual(['row']) // invalid col and block
    expect(board.isPossibleNumber(1, 2, unique)).toEqual([]) // invalid row, col and block
})

test('it should generate random board with 58 empty spaces', () => {
    expect(new Board(23).sudoku.split('.').length-1).toBe(58)
})