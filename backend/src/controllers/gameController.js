const Session = require('../models/Session');
const Game = require('../sudoku/Game');

class GameController {

    // POST /api/restart
    static async restart(code, difficulty, res) {
        this.consume(code, res, (game, update) => {
            game.restart(difficulty);
            update();
        });
    }

    // GET /api/hint
    static async hint(code, res) {
        this.consume(code, res, (game, update) => {
            game.hint();
            update();
        });
    }

    // PUT /api/define
    static async define(code, cell, value, res) {
        this.consume(code, res, (game, update) => {
            game.setCell(cell, value);
            update();
        });
    }

    // PUT /api/delete
    static async delete(code, cell, res) {
        this.consume(code, res, (game, update) => {
            game.delete(cell);
            update();
        });
    }

    // PUT /api/undo
    static async undo(code, res) {
        this.consume(code, res, (game, update) => {
            game.undo();
            update();
        });
    }
    

    // get game session by code (may reply w/ 404 if invalid)
    static async getSession(code, res) {
        const session = await Session.findOne({ code });
        if (!session) res.status(404).send({ error: 'Código de sessão inválido ou expirado.' });

        // refresh sudoku's match lifespan
        Session.updateOne({code}, { expires: new Date(+new Date() + Session.expireTimeout)});

        return [session.gameBoard, session.userBoard, session.history];
    }

    // consumes the Game API and returns a callback to update the game in the DB
    static async consume(code, res, callback) {
        try {
            const session = await this.getSession(code, res);
            if (!session) return;
            
            const game = Game.constructFromData(...session);
            callback(game,
                async () => {
                    const gameBoard = game.gameBoard.sudoku;
                    const userBoard = game.userBoard.sudoku;

                    try {
                        await Session.updateOne({code}, {
                            gameBoard,
                            userBoard,
                            history: game.history
                        });

                        res.send({
                            gameBoard,
                            userBoard
                        });
                    } catch (err) {
                        res.status(400).send({ error: 'Falha ao conectar-se com o jogo.' });
                    }
                }
            );
        } catch (err) {
            res.status(400).send({ error: 'Falha ao realizar ação, parâmetros inválidos.' });
        }
    }
}

module.exports = GameController;