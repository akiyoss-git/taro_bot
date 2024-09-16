import tokens from "./tokens.json" assert { type: "json" };
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

const TEST = false;

const TOKEN = tokens.telegram_token;
const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`

function createTextMessage(prediction, chat_id){
    const sendingBody = { "chat_id": chat_id, "text": prediction };
    return JSON.stringify(sendingBody);
}

function createImageMessage(imageStream, chat_id){
    const photoUrl = `https://api.telegram.org/bot${TOKEN}/sendPhoto?chat_id=${chat_id}`
    let form = new FormData();
    form.append("photo", imageStream);
    form.append("disable_notification", "true");
    return { method: "POST", body: form }
}

export async function createTelegramPost(prediction, imageStream, isTest) {
    const CHAT_ID = isTest ? tokens.telegram_chatId_test : tokens.telegram_chatId;
    // let res0 = await fetch(photoUrl, createImageMessage(imageStream, CHAT_ID));
    // console.log(res0);
    await fetch(url, { method: "POST", body: createTextMessage(prediction, CHAT_ID), headers: { "Content-Type": "application/json" } });
}
