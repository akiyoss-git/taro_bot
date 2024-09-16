import { PythonShell } from 'python-shell'

export async function getLayoutImage(layout) {
    // const cardPaths = layout.map(card => `./cardImages/${card.name}.png`)
    // await PythonShell.run('createImage.py', {args: cardPaths}, (err) => {
    //     if (err) throw err;
    // });
    // let readStream = fs.createReadStream("./image.png");
    // return readStream;
}

async function pyshtest(layout) {
    const cardPaths = layout.map(card => `./cardImages/${card.name}.png`)
    await PythonShell.run('createImage.py', {args: cardPaths}, (err) => {
        if (err) throw err;
    });
}

pyshtest()