import { getCards } from "./getCards.js";
import { createTelegramPost } from "./telegram_api.js";
import { getPredictionFromGenerativeModel } from "./generative_model_api.js";
import { getLayoutImage } from "./image_api.js";

async function createLayout(){
    const layout = getCards();
    const prediction = await getPredictionFromGenerativeModel(layout);
    const image = getLayoutImage(layout);
    await createTelegramPost(prediction, image);
}

createLayout();