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
const LAYOUT_PROMPT = `Ты таролог с огромным стажем. Каждый день ты делаешь расклады и рассказываешь людям судьбу на текущий день по выпавшим картам. В следующем сообщении я пришлю тебе выпавшие карты, их значения и символы в определенном порядке в формате JSON. По ним ты должен построить свой максимально развернутый прогноз на минимум 800 знаков и максимум 1500 знаков с описанием влияния каждой выпавшей карты. Свой ответ тебе следует начинать с фразы "По картам, выпавшим сегодня, я вижу следующее: " или подобной. В конце необходимо сделать вывод по предсказанию. Задача ясна?`;
const TAROSKOP_PROMPT = `Ты таролог с огромным стажем. Каждй день ты делаешь тароскопы на все 12 знаков зодиака. Начинай каждый тароскоп с названия знака зодиака, его значка и двоеточия. Также в начале тароскопа в скобочках должно быть название выпавшей карты. Обязательно разделяй тароскопы пустыми линиями. Тароскопы не должны быть длиннее двух предложений. Тароскопы должны быть мемными, используй актуальные на текущий момент шутки. Общая длина предсказания должна быть не длиннее 1500 знаков. Следующим предложением тебе будут присланы выпавшие 12 карт в формате JSON содержащие название (ключ name), символы (ключ symbols) и значения (ключ symbols). Задача ясна?`

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

export async function getPredictionFromGenerativeModel(layout, round) {
    const token = await getToken()
    const headers = { Authorization: `Bearer ${token}` }
    let body = {
        "model": "GigaChat",
        "messages": [
            {
                "role": "user",
                "content": LAYOUT_PROMPT
            }
        ],
        "n": 3,
        "stream": false,
        "max_tokens": 256*3,
        "repetition_penalty": 1,
        "update_interval": 0
    };

    let res0 = await fetch(URL, { method: "POST", body: JSON.stringify(body), headers });
    let resText0 = await res0.text();
    console.log("Sent instructions, round " + round);
    resText0 = JSON.parse(resText0);
    body.messages.push(resText0.choices[0].message);
    const cardInfo = layout.map(card => {
        return {
            name: card.name,
            symbols: card.symbols,
            meanings: card.meanings
        }
    });
    const timeInfo = {
        morning: [cardInfo[0], cardInfo[1], cardInfo[2]],
        day: [cardInfo[3], cardInfo[4]],
        evening: [cardInfo[5]]
    }
    body.messages.push({ role: "user", content: JSON.stringify(timeInfo) });
    let res1 = await fetch(URL, { method: "POST", body: JSON.stringify(body), headers });
    let resText1 = await res1.text();
    console.log("Sent layout, round: "  + round);
    resText1 = JSON.parse(resText1);
    console.log(resText1);
    let prediction = "none";
    let maxLength = 0;
    for (let pred of resText1.choices) {
        console.log(pred.message.content.length, pred.finish_reason, pred.message.content);
        if (pred.message.content.length > 1023 || pred.message.content.length < 750) continue;
        if (pred.message.content.length > maxLength && pred.finish_reason === 'stop') {
            maxLength = pred.message.content.length;
            prediction = pred.message.content;
        }
    };
    if (prediction === "none") {
        res1 = await fetch(URL, { method: "POST", body: JSON.stringify(body), headers });
        resText1 = await res1.text();
        console.log("Sent layout, round: "  + round + 1);
        resText1 = JSON.parse(resText1);
        prediction = "none";
        let maxLength = 0;
        for (let pred of resText1.choices) {
            console.log(pred.message.content.length, pred.finish_reason, pred.message.content);
            if (pred.message.content.length > 1023 || pred.message.content.length < 750) continue;
            if (pred.message.content.length > maxLength && pred.finish_reason === 'stop') {
                maxLength = pred.message.content.length;
                prediction = pred.message.content;
            }
        };
    }
    if (prediction === "none") {
        res1 = await fetch(URL, { method: "POST", body: JSON.stringify(body), headers });
        resText1 = await res1.text();
        console.log("Sent layout, round: "  + round + 2);
        resText1 = JSON.parse(resText1);
        prediction = "none";
        let maxLength = 0;
        for (let pred of resText1.choices) {
            console.log(pred.message.content.length, pred.finish_reason, pred.message.content);
            if (pred.message.content.length > 1023 || pred.message.content.length < 750) continue;
            if (pred.message.content.length > maxLength && pred.finish_reason === 'stop') {
                maxLength = pred.message.content.length;
                prediction = pred.message.content;
            }
        };
    }
    return prediction;
}

export async function getTaroskopFromGenerativeModel(layout) {
    const token = await getToken()
    const headers = { Authorization: `Bearer ${token}` }
    let body = {
        "model": "GigaChat",
        "messages": [
            {
                "role": "user",
                "content": TAROSKOP_PROMPT
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

const testLayout = [{
    "name": "Двойка Пентаклей",
    "number": 65,
    "suit": "Пентакли",
    "symbols": [
        "женщина, балансирующая на двух монетах",
        "адаптация"
    ],
    "meanings": [
        "адаптация",
        "гибкость",
        "необходимость выбора"
    ]
},
{
    "name": "Тройка Пентаклей",
    "number": 66,
    "suit": "Пентакли",
    "symbols": [
        "строители с пентаклями",
        "трудолюбие"
    ],
    "meanings": [
        "трудолюбие",
        "результативность",
        "мастерство"
    ]
},
{
    "name": "Четвёрка Пентаклей",
    "number": 67,
    "suit": "Пентакли",
    "symbols": [
        "четыре пентакля",
        "жадность"
    ],
    "meanings": [
        "жадность",
        "накопление",
        "контроль"
    ]
},
{
    "name": "Пятёрка Пентаклей",
    "number": 68,
    "suit": "Пентакли",
    "symbols": [
        "пять пентаклей",
        "нужда"
    ],
    "meanings": [
        "нужда",
        "бедность",
        "лишения"
    ]
},
{
    "name": "Шестёрка Пентаклей",
    "number": 69,
    "suit": "Пентакли",
    "symbols": [
        "человек, раздающий пентакли",
        "щедрость"
    ],
    "meanings": [
        "щедрость",
        "помощь",
        "делиться"
    ]
},
{
    "name": "Семёрка Пентаклей",
    "number": 70,
    "suit": "Пентакли",
    "symbols": [
        "человек, рассматривающий пентакль",
        "оценка"
    ],
    "meanings": [
        "оценка результатов",
        "терпение",
        "награда за труд"
    ]
},]

const cardInfo = testLayout.map(card => {
    return {
        name: card.name,
        symbols: card.symbols,
        meanings: card.meanings
    }
});
const timeInfo = {
    morning: [cardInfo[0], cardInfo[1], cardInfo[2]],
    day: [cardInfo[3], cardInfo[4]],
    evening: [cardInfo[5]]
}

console.log(timeInfo)

// getPredictionFromGenerativeModel(testLayout);