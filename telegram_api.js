import tokens from "./tokens.json" assert { type: "json" };
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

const TEST = false;

const TOKEN = tokens.telegram_token;
const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`

async function createTextMessage(prediction, chat_id){
    const sendingBody = { "chat_id": chat_id, "text": prediction };
    console.log('sending text predictions');
    await fetch(url, { method: "POST", body: sendingBody, headers: { "Content-Type": "application/json" } });
}

async function createImageMessage(imageStream, chat_id){
    const photoUrl = `https://api.telegram.org/bot${TOKEN}/sendPhoto?chat_id=${chat_id}`
    let form = new FormData();
    form.append("photo", imageStream);
    form.append("disable_notification", "true");
    console.log('sending cards picture');
    await fetch(photoUrl, { method: "POST", body: form });
}

export async function createTelegramPost(prediction, imageStream, isTest) {
    const CHAT_ID = isTest ? tokens.telegram_chatId_test : tokens.telegram_chatId;
    // createImageMessage(imageStream, CHAT_ID);
    createTextMessage(prediction, CHAT_ID);
}
