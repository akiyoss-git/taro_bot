import { getCards } from "./getCards";
import { createTelegramPost } from "./telegram_api";
import { getPredictionFromGenerativeModel } from "./generative_model_api";
import { getLayoutImage } from "./image_api";

function createLayout(){
    const layout = getCards();
    const prediction = getPredictionFromGenerativeModel(layout);
    const image = getLayoutImage(layout);
    createTelegramPost(prediction, image);
}

createLayout();