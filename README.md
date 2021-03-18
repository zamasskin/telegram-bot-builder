# telegram-bot-builder
Конструктор ботов в телеграмм. 
 
## Установка
Требуется подключение к бд MYSQL
* Склонировать данный репозиторий.
* Создать .env файл
* Добавить настройки в файл .env, пример ниже
```s
NTBA_FIX_319=1
DB_HOST=databaseHost
DB_PORT=databasePort
DB_USER=databaseUser
DB_PASS=databasePassword
DB_NAME=databaseName
TELEGRAM_TOKEN=1606329694:AAEiBscB5V51m9TPJTTyqXWaCGRoZUSCUSc
```
* Выполнить миграцию
```sh
$ npm run migrate
```

## Запуск
```sh
$ npm run start
```