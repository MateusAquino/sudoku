require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const timer = require('./src/utils/timer');
const cors = require('cors');
const api = '/api';

const app = express();

app.use(cors());

app.use(api, bodyParser.json());
app.use(api, bodyParser.urlencoded({ extended: false }));

app.use(api, routes);

app.listen(process.env.PORT || 3000);

timer.start();

module.exports = app;