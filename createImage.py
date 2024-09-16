import sys
import os

def main():
    os.remove('./image.png')
    f = open("demofile2.txt", "a")
    f.write("".join(sys.argv))
    f.close()

main()