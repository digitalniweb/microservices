# How it works

We need to run "globalData" microservice first and then other services. Redis must be installed. "globalData" microservice works as "service registry" and it registers all services and applications via Redis messaging system automatically on service start.

Then all microservices and applications can communicate with each other via "microserviceCall" and "appCall" methods in "/digitalniweb-custom/helpers/remoteProcedureCall.ts" repectively.

Every microservice and application needs submodules https://github.com/digitalniweb/digitalniweb-types and https://github.com/digitalniweb/digitalniweb-custom

## Microservices

### GlobalData

You need to run seeders to work properly because we need languages.

### Websites

#### modules

Are big self contained components like pages, products, blog posts, news, etc.

1. Modules like pages and products have their own menus

2. Modules like blog posts and news on the other hand have list pagination of all posts / articles

3. There might be other modules with different functionalities

#### widgets

Are smaller components inside modules like text, banner, etc.

## Applications

-   see https://github.com/digitalniweb/saas

# Other information

## Migrations

-   [documentation](https://https://sequelize.org/docs/v6/other-topics/migrations/)

Migrations have dedicated table in database unlike seeders

### Up

    npx sequelize-cli db:migrate

### Down

revert the most recent migration (from DB):

    npx sequelize-cli db:migrate:undo

revert all:

    npx sequelize-cli db:migrate:undo:all

## Seeders

-   [documentation](https://https://sequelize.org/docs/v6/other-topics/migrations/)

### Up

    npx sequelize-cli db:seed:all

### Down

revert the most recent seeder (only last file via date name):

    npx sequelize-cli db:seed:undo

revert specific seed:

    npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data

revert all:

    npx sequelize-cli db:seed:undo:all
