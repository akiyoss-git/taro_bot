import { getCards } from "./getCards.js";
import { createTelegramPost } from "./telegram_api.js";
import { getPredictionFromGenerativeModel } from "./generative_model_api.js";
import { getLayoutImage } from "./image_api.js";

async function createLayout(){
    const isTest = process.argv[2] ? process.argv[2] === '-test' ? true : false : false;
    const layout = getCards();
    const prediction = await getPredictionFromGenerativeModel(layout);
    const imageStream = getLayoutImage(layout);
    await createTelegramPost(prediction, imageStream, isTest);
}

createLayout();