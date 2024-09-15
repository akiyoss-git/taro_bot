import tokens from "./tokens.json" assert { type: "json" };
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

const TOKEN = tokens.telegram_token;
const CHAT_ID = tokens.telegram_chatId;
const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`
const photoUrl = `https://api.telegram.org/bot${TOKEN}/sendPhoto?chat_id=${CHAT_ID}`

function createTextMessage(prediction){
    const sendingBody = { "chat_id": CHAT_ID, "text": prediction };
    return JSON.stringify(sendingBody);
}

function createImageMessage(image){
    let readStream = fs.createReadStream("./image.jpg");

    let form = new FormData();
    form.append("photo", readStream);
    form.append("disable_notification", "true");
    return { method: "POST", body: form }
}

export async function createTelegramPost(prediction, image) {
    // let res0 = await fetch(photoUrl, createImageMessage("./image.jpg"));
    // console.log(res0);
    await fetch(url, { method: "POST", body: createTextMessage(prediction), headers: { "Content-Type": "application/json" } });
}
