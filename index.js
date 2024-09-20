import { getCards, getTaroskopCards } from "./getCards.js";
import { createTelegramPost } from "./telegram_api.js";
import { getPredictionFromGenerativeModel, getTaroskopFromGenerativeModel } from "./generative_model_api.js";
import { getLayoutImage } from "./image_api.js";

async function createLayout(){
    const isTest = process.argv[3] ? process.argv[3] === '-test' ? true : false : false;
    const layout = getCards();
    const prediction = await getPredictionFromGenerativeModel(layout, 0);
    const imageStream = await getLayoutImage(layout);
    console.log(prediction.length);
    await createTelegramPost(prediction, imageStream, isTest);
}

async function createTaroskop(){
    const isTest = process.argv[3] ? process.argv[3] === '-test' ? true : false : false;
    const layout = getTaroskopCards();
    const prediction = await getTaroskopFromGenerativeModel(layout);
    const imageStream = await getLayoutImage(layout);
    console.log(prediction.length);
    await createTelegramPost(prediction, imageStream, isTest);
}

if (process.argv[2] === '-taroskop') {
    createTaroskop()
} else {
    createLayout();
}
