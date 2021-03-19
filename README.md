# telegram-bot-builder
Конструктор ботов в телеграмм. 
 
## Установка
Требуется подключение к бд MYSQL
* Склонировать данный репозиторий.
* Выполнить устоновку модулей nodejs
* Создать .env файл
* Добавить настройки в файл .env, пример ниже
```s
NTBA_FIX_319=1
DB_HOST=databaseHost
DB_PORT=databasePort
DB_USER=databaseUser
DB_PASS=databasePassword
DB_NAME=databaseName
TELEGRAM_TOKEN=#########################
```
* Выполнить миграцию
```sh
$ npm run migrate
```
* Выполнить билд, для копирования всех системных файлов
```sh
$ npm run build
```

## Запуск
```sh
$ npm run start
```