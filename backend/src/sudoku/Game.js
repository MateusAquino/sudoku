const Board = require('./Board');
const diffStringsIndex = require('../utils/diffStringsIndex');

class Game {
    constructor(qnt=null) {
        this.gameBoard = new Board(qnt > 81 ? 81 : (qnt < 0 ? 0 : qnt));
        this.userBoard = new Board();
        this.history = [];
    }

    static constructFromData(gameBoard, userBoard, history = []) {
        const game = new Game();
        game.gameBoard = new Board(gameBoard);
        game.userBoard = new Board(userBoard);
        game.history = history;
        return game;
    }

    restart(qnt) {
        this.gameBoard = new Game(qnt).gameBoard;
        this.userBoard = new Board();
        this.history = [];
    }

    hint() {
        let hint = this.merge().solveNext(1),
            userBoard = this.userBoard.toString(),
            board = this.gameBoard.toArray();
        if (!this.merge().toString().includes('.')) return false;
        
        if (hint) {
            let withHint = this.merge(),
                withHintIndex = diffStringsIndex(hint, withHint.toString());
            this.gameBoard.replaceCell(withHintIndex, hint[withHintIndex])
            return this.gameBoard.toString();
        }
        for (const i in userBoard) {
            board[i] = board[i]==='0' ? userBoard[i] : board[i];
            let newHint = new Board(board.join(''));
            if (!newHint.solve()) {
                this.userBoard.replaceCell(i, '.')
                return this.gameBoard.toString();
            }
        }
    }

    undo() {
        if (!this.history.length) return;
        let lastChange = this.history.pop();
        this.userBoard.replaceCell(...lastChange);
    }

    delete(cell) {
        this.setCell(cell, '.')
    }

    setCell(cell, value) {
        let merge = this.merge().sudoku;
        let condition = this.gameBoard.isPossibleNumber(cell, value==='.'?0:value, merge);
        if (condition.length !== 3)
            throw new Error('Movimento inválido. !['+condition+']');
        if (this.userBoard.toString()[cell] != value)
            this.history.push([cell, merge[cell]]);
        this.userBoard.replaceCell(cell, value);
        return this;
    }

    merge() {
        let gameBoard = this.gameBoard.toString(),
            userBoard = this.userBoard.toString(),
            board=[];
        for (const i in gameBoard)
            board[i]  = gameBoard[i] === '.' 
                      ? userBoard[i]
                      : gameBoard[i];
        return new Board(board.join(''));
    }

    static newGame(difficulty) {
        const game = new Game(difficulty);
        return {game, gameBoard: game.gameBoard.sudoku, userBoard: game.userBoard.sudoku};
    }
}

module.exports = Game;