import { PythonShell } from 'python-shell'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs  = require("fs");

const OPTIONS = {
    mode: 'text',
    pythonPath: './.venv/Scripts/python.exe',
    pythonOptions: ['-u'], 
    scriptPath: './',
    args: []
  };

export async function getLayoutImage(layout) {
    const cardPaths = layout.map(card => `./cardImages/${card.number}.png`);
    OPTIONS.args = cardPaths;
    await PythonShell.run('createImage.py', OPTIONS, (err) => {
        if (err) throw err;
    });
    let readStream = fs.createReadStream('./image.png');
    return readStream;
}