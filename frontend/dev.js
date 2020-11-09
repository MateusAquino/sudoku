var exec = require('child_process').exec;

function spawn(cmd, prefix) {
    exec(cmd).stdout.on('data', data=>{if (data.trim()) console.log(`${prefix?`[${prefix}]: `:''}${data.trim()}`)});
    exec(cmd).stderr.on('data', data=>{if (data.trim()) console.log(`${prefix?`![${prefix}]: `:''}${data.trim()}`)});
}

const args = process.argv;
const argsOpen = args && args.includes('--open');
const autoCompile = args && args.includes('--auto-compile');
const withBackend = args && args.includes('--with-backend');
const location = args && args.includes('--from-src') ? 'src/' : 'build/';

if (autoCompile) {
    spawn('pug -w ./frontend/src -o ./frontend/src/html -P', 'Pug');
    spawn('node-sass -w --output-style compressed ./frontend/src/scss/main.scss ./frontend/src/css/main.min.css', 'Sass');
}
if (argsOpen)
    setTimeout(()=>exec('explorer \"http://localhost:3000\" || xdg-open \"http://localhost:3000\" || open \"http://localhost:3000\"'), 2000);

const express = require('express');
const app = withBackend ? require('../backend/index') : express();

app.use(express.static(process.cwd() + '/frontend/' + location));
app.use('/', express.static(process.cwd() + '/frontend/' + location + 'html'));

if (!withBackend) app.listen(3000);