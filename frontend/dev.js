var exec = require('child_process').exec;

function spawn(cmd, prefix) {
    exec(cmd).stdout.on('data', data=>{if (data.trim()) console.log(`${prefix?`[${prefix}]: `:''}${data.trim()}`)});
    exec(cmd).stderr.on('data', data=>{if (data.trim()) console.log(`${prefix?`![${prefix}]: `:''}${data.trim()}`)});
}

const args = process.argv;
if (args && args.includes('--auto-compile')) {
    spawn('pug -w ./frontend/src -o ./frontend/src/html -P', 'Pug');
    spawn('node-sass -w --output-style compressed ./frontend/src/scss/main.scss ./frontend/src/css/main.min.css', 'Sass');
}
if (args && args.includes('--open')) {
    setTimeout(()=>exec('explorer \"http://localhost:80\" || xdg-open \"http://localhost:80\" || open \"http://localhost:80\"'), 2000);
}

const express = require('express');
const app = express();

app.use(express.static(process.cwd() + '/frontend/src/'));
app.use('/', express.static(process.cwd() + '/frontend/src/html'));

app.listen(80);