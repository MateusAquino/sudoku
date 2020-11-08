var exec = require('child_process').exec;

function spawn(cmd, prefix) {
    exec(cmd).stdout.on('data', data=>{if (data.trim()) console.log(`${prefix?`[${prefix}]: `:''}${data.trim()}`)});
    exec(cmd).stderr.on('data', data=>{if (data.trim()) console.log(`${prefix?`![${prefix}]: `:''}${data.trim()}`)});
}

spawn('pug -w ./frontend/src -o ./frontend/src/html -P', 'Pug');
spawn('node-sass -w --output-style compressed ./frontend/src/scss/main.scss ./frontend/src/css/main.min.css', 'Sass');
spawn('node ./frontend/devserver.js');
exec('explorer \"http://localhost:80\" || xdg-open \"http://localhost:80\" || open \"http://localhost:80\"');