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
    
    columns = 5
    rows = 3
    
    horizontal_margin = 40
    vertical_margin = 20

    # images = os.listdir('./cardImages')
    # print(images)
    # imagePaths = sys.argv[1:]
    imagePaths = createTestImagePaths()
    print(imagePaths)
    image_objs = [cv2.imread(f'./cardImages/{filename}') for filename in imagePaths]
    print(list(map(lambda img: img.shape, image_objs)))
    file_name = os.path.join('./cardImages', f'{imagePaths[0]}')

    shape = cv2.imread(file_name, cv2.IMREAD_COLOR).shape

    big_image = numpy.zeros((shape[0] * rows + horizontal_margin * (rows + 1), 
                             shape[1] * columns + vertical_margin * (columns + 1),
                             shape[2]), numpy.uint8)
    
    big_image.fill(255)

    
    positions = [
        (0, 0),
        (2, 0),
        (4, 0),
        (1, 1),
        (3, 1),
        (2, 2)
    ]
    
    
    for (pos_x, pos_y), image in zip(positions, image_objs):
        print(image.shape)
        if image.shape[0] == 0:
            continue
        x = pos_x * (shape[1] + vertical_margin) + vertical_margin
        y = pos_y * (shape[0] + horizontal_margin) + horizontal_margin
        big_image[y:y+shape[0], x:x+shape[1]] = image
        
    cv2.imwrite('image.png', big_image)
    # f = open("demofile2.txt", "w", encoding='utf8')
    # imagePaths = sys.argv[1:]
    # f.write(" ".join(imagePaths))
    # f.close()

main()