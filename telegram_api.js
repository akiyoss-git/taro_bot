import tokens from "./tokens.json" assert { type: "json" };
import fetch from "node-fetch";
import FormData from "form-data"

const TEST = false;

const TOKEN = tokens.telegram_token;
const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`

async function createTextMessage(prediction, chat_id) {
    const sendingBody = { "chat_id": chat_id, "text": prediction };
    console.log('sending text predictions');
    await fetch(url, { method: "POST", body: JSON.stringify(sendingBody), headers: { "Content-Type": "application/json" } });
}

async function createImageMessage(imageStream, prediction, chat_id) {
    const photoUrl = `https://api.telegram.org/bot${TOKEN}/sendPhoto`
    let form = new FormData();
    form.append('chat_id', chat_id);
    form.append("photo", imageStream);
    form.append('caption', prediction);
    form.append("disable_notification", "true");
    console.log('sending cards picture');
    await fetch(photoUrl, { method: "POST", body: form, headers: form.getHeaders() });
}

export async function createTelegramPost(prediction, imageStream, isTest) {
    const CHAT_ID = isTest ? tokens.telegram_chatId_test : tokens.telegram_chatId;
    if (imageStream && prediction !== "none") await createImageMessage(imageStream, prediction, CHAT_ID);
    // await createTextMessage(prediction, CHAT_ID);
}