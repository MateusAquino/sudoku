const Game = require('./Game')

const solved      = "276314958854962713913875264468127395597438621132596487325789146641253879789641532"
const unique      = "2..3.....8.4.62..3.138..2......2.39.5.7...621.32..6....2...914.6.125.8.9.....1..2"
const invalid     = "...456...123...789...456...123...789...456...123...789...456...123...789...456..."
const merged      = "2..356...824.62783.138562..123.2.3995.7456621132..6789.2.45914.62125.889...451..2"
const unsolvable  = "...2.....8.4.62..3.138..2......2.39.5.7...621.32..6....2...914.6.125.8.9.....1..2"

test('it should generate an empty game', () => {
    expect(new Game(-1).gameBoard.sudoku).toBe('.'.repeat('81'))
    expect(new Game().gameBoard.sudoku).toBe('.'.repeat('81'))
})

test('it should generate random board with 58 empty spaces', () => {
    expect(new Game(23).gameBoard.sudoku.split('.').length-1).toBe(58)
})

test('it should generate solved board', () => {
    expect(new Game(100).gameBoard.sudoku.split('.').length-1).toBe(0)
})

test('it should construct statically', () => {
    expect(Game.newGame(23).gameBoard.split('.').length-1).toBe(58)
})

test('it should construct a game from data', () => {
    const withoutHistory = Game.constructFromData(unique, solved)
    const withHistory = Game.constructFromData(unique, solved, [[2,3]])
    expect(withoutHistory.gameBoard.sudoku).toBe(unique)
    expect(withoutHistory.userBoard.sudoku).toBe(solved)
    expect(withoutHistory.history).toEqual([])
    expect(withHistory.gameBoard.sudoku).toBe(unique)
    expect(withHistory.userBoard.sudoku).toBe(solved)
    expect(withHistory.history).toEqual([[2,3]])
})

test('it should restart with a different difficulty', () => {
    const game = new Game(100)
    game.restart(23)
    expect(game.gameBoard.sudoku.split('.').length-1).toBe(58)
    expect(game.userBoard.sudoku.split('.').length-1).toBe(81)
    expect(game.history).toEqual([])
})

test('it should define a cell', () => {
    const validChange      = new Game('.'+unique.substr(1))
    const unsolvableChange = new Game('.'+unique.substr(1))
    const invalidChange    = new Game('.'+unique.substr(1))
    
    expect(validChange.setCell(0, 2).userBoard.sudoku[0]).toBe('2')
    expect(unsolvableChange.setCell(0, 7).userBoard.sudoku[0]).toBe('7')
    expect(()=>invalidChange.setCell(0, 3)).toThrow('Movimento inválido. ![col]') // invalid row and block
})

test('it should delete a cell', () => {
    const game = Game.constructFromData('.'.repeat(81), '.2'+'.'.repeat(79))
    game.delete(0)
    game.delete(1)
    expect(game.userBoard.sudoku[0]).toBe('.')
    expect(game.userBoard.sudoku[1]).toBe('.')
})

test('it should undo change', () => {
    const withoutHistory = Game.constructFromData(unique, solved)
    const withHistory = Game.constructFromData(unique, solved, [[4,5],[2,3]])
    withoutHistory.undo()
    withHistory.undo()
    expect(withoutHistory.history).toEqual([])
    expect(withHistory.history).toEqual([[4,5]])
})

test('it should merge boards', () => {
    const game = Game.constructFromData(unique, invalid)
    expect(game.merge().sudoku).toBe(merged)
})

test('it should give hints', () => {
    const game = Game.constructFromData(unique, '2.' + solved.substr(2))
    game.hint()
    expect(game.merge().sudoku).toBe(solved)
})

test('it should return false giving hints to complete board', () => {
    const game = Game.constructFromData(unique, solved)
    expect(game.hint()).toBeFalsy()
})

test('it should erase user\'s answer if unsolvable board', () => {
    const solvableBoard = '2...'+unique.substr(4)
    const game = Game.constructFromData(solvableBoard, unsolvable)
    game.hint()
    expect(game.merge().sudoku).toBe(solvableBoard)
})