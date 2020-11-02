const Board = require('./Board');

class Game {
    constructor(qnt) {
        this.gameBoard = new Board(qnt);
        this.userBoard = new Board();
        this.history = [];
    }

    hint() {
        let hint = this.merge().solveNext(1),
            userBoard = this.userBoard.toString(),
            board = this.gameBoard.toArray(),
            oldHint = null;
        if (hint) return (this.gameBoard = new Board(hint)).toString();

        for (const i in userBoard) {
            board[i] = userBoard;
            let newHint = new Board(board.join(''));
            if (newHint.solve())
                oldHint = newHint;
            else {
                if (oldHint)
                    return (this.gameBoard = oldHint).toString();
                return this.gameBoard.solveNext(1);
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
        let merge = this.merge();
        this.history.push([cell, merge[cell]]);
        this.userBoard.replaceCell(cell, value);
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
}

module.exports = Game;