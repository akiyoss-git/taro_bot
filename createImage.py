import sys
import os
import cv2

def getImage(filename):
    src =  cv2.imread(filename["path"])
    if (filename["flipped"]):
        return cv2.rotate(src, cv2.ROTATE_180)
    return src

def main():
    try:
        os.remove('./image.png')
    except FileNotFoundError:
        pass
    
    
    horizontal_margin = 60
    vertical_margin = 30

    imagePaths = sys.argv[1:]
    imagePaths_n = []
    for path in imagePaths:
        path_n = path.split("_")
        imagePaths_n.append({"path": path_n[0], "flipped": True if path_n[1] == "flip" else False})
    print(imagePaths_n)
    image_objs = [cv2.resize(getImage(filename), (202, 352)) for filename in imagePaths_n]
    print(list(map(lambda img: img.shape, image_objs)))

    shape = image_objs[0].shape
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

main()