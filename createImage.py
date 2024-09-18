import sys
import os
import cv2

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