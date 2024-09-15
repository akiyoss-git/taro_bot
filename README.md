# Бот для таро 
## Начало работы

Для запуска потребуется получить токен бота в телеграме, токен сбер гигачат, скачать сертификат минцифры и положить его в папку с ботом.

Токены положить в файл tokens.json, пример: 
```
{
    "telegram_token": "",
    "telegram_chatId": "",
    "gigachat_client_id": "",
    "gigachat_scope": "",
    "gigachat_client_secret": "",
    "gigachat_auth_data": ""
}
```

После прописать в терминале 
```
npm i
```

и можно запускать командой 
```
node index.js
```

## Что используется

Бот использует API телеграма и API GigaChat

author: akiyoss 2024
