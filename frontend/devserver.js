const express = require('express');
const app = express();

app.use(express.static(process.cwd() + '/frontend/src/'));
app.use('/', express.static(process.cwd() + '/frontend/src/html'));

app.listen(80);