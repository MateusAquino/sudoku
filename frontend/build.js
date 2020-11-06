const fs = require('fs')
var exec = require('child_process').exec;

function build(callback) {
    console.log('[1/4] Compiling sass to css...');
    exec('node-sass --output-style compressed ./frontend/src/scss/main.scss ./frontend/src/css/main.min.css', (x,y,z)=>{
        console.log('[2/4] Compiling pug to html...');
        exec('pug ./frontend/src -o ./frontend/src/html -P', () => {
            callback();
        });
    });
}

async function lsCopy(path) {
  const dir = await fs.promises.opendir(path)
  for await (const child of dir) {
    const relativePath = `${path}/${child.name}`;
    const relativeBuildPath = relativePath.replace('frontend/src', 'frontend/build').replace('/html', '');
    const buildDir = x => (x ? child.isDirectory() : !child.isDirectory()) && !child.name.includes('scss');

    if (buildDir(true)) {
        if (!fs.existsSync(relativeBuildPath))
            fs.mkdirSync(relativeBuildPath);
        lsCopy(relativePath);

    } else if (buildDir(false) && !child.name.endsWith('.pug'))
        fs.createReadStream(relativePath).pipe(
            fs.createWriteStream(relativeBuildPath)
        );
  }
}

console.log('[0/4] Building client-side...');
if (!fs.existsSync('./frontend/build'))
            fs.mkdirSync('./frontend/build');
build(()=>{
    console.log('[3/4] Moving folders and files...');
    lsCopy('./frontend/src').catch(console.error)
    console.log('[4/4] Done!');
});
