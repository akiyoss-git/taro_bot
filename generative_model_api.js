import fetch from 'node-fetch';
import tokens from './tokens.json' assert { type: "json" };

const URL = 'https://openrouter.ai/api/v1/chat/completions';

const LAYOUT_PROMPT = `Ты таролог с огромным стажем. Каждый день ты делаешь расклады и рассказываешь людям судьбу на текущий день по выпавшим картам. В следующем сообщении я пришлю тебе шесть выпавших карт, их значения и символы в определенном порядке в формате JSON. Первые три карты отвечают за утро, следующие две отвечают за день, последняя отвечает за вечер. По этой информации тебе необходимо построить прогноз длиной в 2-3 предложения на время суток. Используй смайлики в предсказаниях. Свой ответ тебе следует начинать с фразы "НАЧАЛО ПРЕДСКАЗАНИЯ". В конце необходимо сделать вывод по предсказанию. Задача ясна?`;
const TAROSKOP_PROMPT = `Ты таролог с огромным стажем. Каждй день ты делаешь тароскопы на все 12 знаков зодиака. Начинай каждый тароскоп с названия знака зодиака, его значка и двоеточия. Также в начале тароскопа в скобочках должно быть название выпавшей карты. Обязательно разделяй тароскопы пустыми линиями. Тароскопы не должны быть длиннее двух предложений. Тароскопы должны быть мемными, используй актуальные на текущий момент шутки. Общая длина предсказания должна быть не длиннее 1500 знаков. Следующим предложением тебе будут присланы выпавшие 12 карт в формате JSON содержащие название (ключ name), символы (ключ symbols) и значения (ключ symbols). Задача ясна?`
// TODO: Переделать промпт на то, чтобы я присылал 3 сообщения с картами и мне возвращались ответы конкретно по ним, и отдально ответ с итогом
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function getPredictionFromGenerativeModel(layout, round) {
    const headers = {
        "Authorization": `Bearer ${tokens.deepseek_token_2}`,
        "Content-Type": "application/json"
    }
    console.log(headers)
    let body = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [
            {
                "role": "user",
                "content": LAYOUT_PROMPT
            }
        ],
        stream: false,
        include_reasoning: false
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
    await sleep(30000);
    let res1 = await fetch(URL, { method: "POST", body: JSON.stringify(body), headers });
    let resText1 = await res1.text();
    console.log("Sent layout, round: " + round);
    resText1 = JSON.parse(resText1);
    let prediction = "none";
    let maxLength = 0;
    if (resText1?.error?.code === 429) {
        sleep(30000)
    } else {
        for (let pred of resText1.choices) {
            console.log("Pred length == " + pred.message.content.length);
            if (pred.message.content.length > 1023 || pred.message.content.length < 750) continue;
            if (pred.finish_reason === 'stop') {
                maxLength = pred.message.content.length;
                prediction = pred.message.content;
            }
        };
    }
    while (prediction === "none") {
        round = round + 1;
        try {
            await sleep(30000);
            res1 = await fetch(URL, { method: "POST", body: JSON.stringify(body), headers });
            resText1 = await res1.text();
            console.log("Sent layout, round: " + round);
            resText1 = JSON.parse(resText1);
            console.log(resText1);
            console.log(resText1.choices);
            for (let pred of resText1.choices) {
                let msg = pred.message.content.split('НАЧАЛО ПРЕДСКАЗАНИЯ')[1]
                console.log("Pred length == " + msg.length);
                if (msg.length > 1023 || msg.length < 750) continue;
                if (msg.length > maxLength && pred.finish_reason === 'stop') {
                    maxLength = msg.length;
                    prediction = msg;
                    break;
                }
            };
            console.log(prediction);
        } catch (e) {
            console.log(e);
            continue;
        }
    }
    return prediction.replaceAll('*', '').replace('НАЧАЛО ПРЕДСКАЗАНИЯ', '');
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

// console.log(timeInfo)
// console.log(await getPredictionFromGenerativeModel(testLayout, 0));