import taro from "./taro.json" with { type: "json" };

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

export function getCards() {
    let cards = taro.cards;
    shuffle(cards);
    let layout = [];
    for (let i = 0; i < 6; i++) {
        const flipped = Math.random() > 0.5 ? true : false;
        layout.push({ ...cards[i], flipped})
    }
    console.log("Got cards: ", layout.map(card => card.name + (card.flipped ? "_flip" : "")).join(", "));
    return layout;
}

export function getTaroskopCards() {
    let cards = taro.cards;
    shuffle(cards);
    let layout = [];
    for (let i = 0; i < 12; i++) {
        const flipped = Math.random() > 0.5 ? true : false;
        layout.push({ ...cards[i], flipped})
    }
    console.log("Got cards: ", layout.map(card => card.name).join(", "));
    return layout;
}