import { PythonShell } from 'python-shell'
import { open } from 'node:fs/promises'

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
    let fd = await open("./image.png");
    let readStream = fd.createReadStream();
    fd.close()
    return readStream;
}

async function pyshtest(layout) {
    OPTIONS.args = layout.map(card => `./cardImages/${card.number}.png`)
    await PythonShell.run('createImage.py', OPTIONS, (err) => {
        if (err) throw err;
    });
}

const testLayout = [
    {
        "name": "Шут",
        "number": 0,
        "suit": "Младшие арканы",
        "symbols": [
            "дурак",
            "путник"
        ],
        "meanings": [
            "начало нового пути",
            "беззаботность",
            "отсутствие опыта"
        ]
    },
    {
        "name": "Маг",
        "number": 1,
        "suit": "Младшие арканы",
        "symbols": [
            "фокусник",
            "творец"
        ],
        "meanings": [
            "сила воли",
            "контроль над ситуацией",
            "новаторство"
        ]
    },
    {
        "name": "Жрица",
        "number": 2,
        "suit": "Младшие арканы",
        "symbols": [
            "дева",
            "прорицательница"
        ],
        "meanings": [
            "интуиция",
            "тайна",
            "женская мудрость"
        ]
    },
    {
        "name": "Императрица",
        "number": 3,
        "suit": "Младшие арканы",
        "symbols": [
            "мать",
            "природа"
        ],
        "meanings": [
            "плодородие",
            "материнство",
            "развитие"
        ]
    },
    {
        "name": "Император",
        "number": 75,
        "suit": "Младшие арканы",
        "symbols": [
            "отец",
            "правитель"
        ],
        "meanings": [
            "власть",
            "стабильность",
            "сильное лидерство"
        ]
    },
    {
        "name": "Иерофант",
        "number": 5,
        "suit": "Младшие арканы",
        "symbols": [
            "священник",
            "помощник"
        ],
        "meanings": [
            "советы",
            "понимание",
            "эмпатия"
        ]
    }
]

getLayoutImage(testLayout)