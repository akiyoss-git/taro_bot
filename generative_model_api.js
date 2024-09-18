import fetch from 'node-fetch';
import tokens from './tokens.json' assert { type: "json" };
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

process.env.NODE_EXTRA_CA_CERTS = path.resolve('./')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const SCOPE = tokens.gigachat_scope;
const AUTH_DATA = tokens.gigachat_auth_data;
const URL = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';
const AUTH_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";

async function getToken() {
    const headers = {
        "RqUID": uuidv4(),
        "Authorization": `Basic ${AUTH_DATA}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    };
    const body = `scope=${SCOPE}`;
    let res1 = await fetch(AUTH_URL, { method: "POST", body, headers });
    let resText = await res1.text();
    console.log("Got token");
    return JSON.parse(resText).access_token;
}

export async function getPredictionFromGenerativeModel(layout) {
    const token = await getToken()
    const headers = { Authorization: `Bearer ${token}` }
    let body = {
        "model": "GigaChat",
        "messages": [
            {
                "role": "user",
                "content": `Ты таролог с огромным стажем. Каждый день ты делаешь расклады и рассказываешь людям судьбу на текущий день по выпавшим картам. В следующем сообщении я пришлю тебе выпавшие карты, их значения и символы в определенном порядке в формате JSON. По ним ты должен построить свой максимально развернутый прогноз на минимум 800 знаков и максимум 1500 знаков с описанием влияния каждой выпавшей карты. Свой ответ тебе следует начинать с фразы "По картам, выпавшим сегодня, я вижу..." или подобной. В конце необходимо сделать вывод по предсказанию. Задача ясна?`
            }
        ],
        "n": 1,
        "stream": false,
        "max_tokens": 2048,
        "repetition_penalty": 1,
        "update_interval": 0
    };

    let res0 = await fetch(URL, { method: "POST", body: JSON.stringify(body), headers });
    let resText0 = await res0.text();
    console.log("Sent instructions");
    resText0 = JSON.parse(resText0);
    body.messages.push(resText0.choices[0].message);
    const cardInfo = layout.map(card => {
        return {
            name: card.name,
            symbols: card.symbols,
            meanings: card.meanings
        }
    });
    body.messages.push({ role: "user", content: JSON.stringify(cardInfo) });
    let res1 = await fetch(URL, { method: "POST", body: JSON.stringify(body), headers });
    let resText1 = await res1.text();
    console.log("Sent layout");
    resText1 = JSON.parse(resText1);
    return resText1.choices[0].message.content
}
