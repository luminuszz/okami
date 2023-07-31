<p align="center">
  <img src="./images/okami-logo.png" width="200" alt="Nest Logo" />
</p>



<p align="center">
  <strong style="font-size:40px">OKAMI SERVER</strong>
</p>


## Description

OKAMI SERVER is module for OKAMI for manage mey mangas, animes and other works.

#### API REST
Serve api rest for **okami-front-end** consume

#### Notion integration
 OKAMI SERVER connect a mongodb database for store works and synchronize with notion database pages


 #### Cron jobs and Queues

 OKAMI SERVER schedules jobs for OKAMI-WORKERS module scrapping workers chapters or episodes for Redis database


 #### Notification
 OKAMI SERVER use telegram for notify with chapter or episode is new


## Installation

For urn okami-server create a ```.env``` in de project dir

```bash
DATABASE_URL=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
DOCKERFILE=
NOTION_AUTH_TOKEN=
NOTION_DATABASE_ID=
TELEGRAM_NOTIFICATION_BOT=
TELEGRAM_CHAT_ID=
```

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
$ yarn run test

```



## Other OKAMI modules 

- [OKAMI-WORKERS](https://github.com/luminuszz/okami-workers)
- [OKAMI-FRONT-END](https://github.com/luminuszz/okami-client)
- [OKAMI-SERVER](https://github.com/luminuszz/okami)

## License

Nest is [MIT licensed](LICENSE).
