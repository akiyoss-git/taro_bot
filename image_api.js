export function getLayoutImage(layout){
    let readStream = fs.createReadStream("./image.jpg");
    return readStream;
}