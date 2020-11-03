const routes = require('express').Router();
const SessionController = require('./controllers/sessionController');
const GameController = require('./controllers/gameController');

// Definição das Rotas
routes.post('/game',   (req, res) => SessionController.create(req.body.difficulty, res));
routes.get('/game',    (req, res) => SessionController.read(req.query.code, res));

routes.get('/hint',    (req, res) => GameController.hint(req.query.code, res));
routes.put('/restart', (req, res) => GameController.restart(req.body.code, req.body.difficulty, res));
routes.put('/define',  (req, res) => GameController.define(req.body.code, req.body.cell, req.body.value, res));
routes.put('/delete',  (req, res) => GameController.delete(req.body.code, req.body.cell, res));
routes.put('/undo',    (req, res) => GameController.undo(req.body.code, res));

module.exports = routes;