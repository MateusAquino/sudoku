const Session = require('../models/Session');
const Game = require('../sudoku/Game');
const hash = require('../utils/hash');
const express = require('express');
const router = express.Router();

// router.get('/game', async (req, res) => {
//     const {}
// });

router.post('/game', (req, res) => {
    try {
        let { difficulty } = req.body;
        difficulty = difficulty > 81 ? 81 : (difficulty<0 ? 0 : difficulty);

        const { gameBoard, userBoard } = new Game(difficulty);
        const sessionPromise = Session.create({
            code: hash(+new Date), 
            gameBoard,
            userBoard
        });
        console.log(sessionPromise)
        sessionPromise.then(session=>{console.log('b');res.send(session)});
    } catch (err) {
        return res.status(400).send({ error: 'Falha na criação da Sessão' })
    }
});

// router.delete('/game')

module.exports = app => app.use('/api', router);