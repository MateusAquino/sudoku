const Session = require('../models/Session');
const Game = require('../sudoku/Game');
const hash = require('../utils/hash');

class SessionController {

    // POST /api/game
    static async create(difficulty, res) {
        try {
            const { gameBoard, userBoard } = Game.newGame(difficulty);
            
            let data;
            do {
                data = {
                    code: hash(+new Date), 
                    gameBoard,
                    userBoard
                };
            } while (await Session.findOne({ code: data.code }));

            const session = await Session.create(data);

            res.send({session});
        } catch (err) {
            return res.status(400).send({ error: 'Falha na criação da sessão.' })
        }
    }

    // GET /api/game
    static async read(code, res) {
        const session = await Session.findOne({ code });
        if (!session) return res.status(404).send({ error: 'Código de sessão inválido ou expirado.' });
        const { gameBoard, userBoard } = session;

        res.send({
            gameBoard,
            userBoard
        });
    }


    // delete all expired sessions (peer: utils/timer.js)
    static async removeExpired() {
        await Session.deleteMany({expires: { $lt: new Date()}})
    }
}

module.exports = SessionController;