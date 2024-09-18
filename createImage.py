import sys
import os
import cv2
import numpy

testLayout = [
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
        "number": 75,
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
        "number": 4,
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

def createTestImagePaths():
    return list(map(lambda card: f'{card['number']}.png', testLayout))

def main():
    try:
        os.remove('./image.png')
    except FileNotFoundError:
        pass
    
    
    horizontal_margin = 60
    vertical_margin = 30

    imagePaths = sys.argv[1:]
    # imagePaths = createTestImagePaths()
    print(imagePaths)
    image_objs = [cv2.resize(cv2.imread(filename), (202, 352)) for filename in imagePaths]
    print(list(map(lambda img: img.shape, image_objs)))

    shape = image_objs[0].shape
    print(shape)
    big_image = cv2.imread('./background.png')

    
    positions = [
        (2, 1),
        (4, 1),
        (6, 1),
        (3, 2),
        (5, 2),
        (4, 3)
    ]
    
    
    for (pos_x, pos_y), image in zip(positions, image_objs):
        print(image.shape)
        if image.shape[0] == 0:
            continue
        x = pos_x * (shape[1] + vertical_margin) + vertical_margin
        y = pos_y * (shape[0] + horizontal_margin) + horizontal_margin
        print(big_image.shape)
        print(y)
        print(y, shape[0]+y)
        print(x)
        print(x, shape[1]+x)
        big_image[y:y+shape[0], x:x+shape[1]] = image
        
    print(big_image.shape)
    cv2.imwrite('image.png', big_image)
    # f = open("demofile2.txt", "w", encoding='utf8')
    # imagePaths = sys.argv[1:]
    # f.write(" ".join(imagePaths))
    # f.close()

main()