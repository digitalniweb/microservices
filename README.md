# How it works

-   Microservices 'globalData' needs to be started first, then other services
-   Redis must be installed. "globalData" microservice works as "service registry" and it registers all services and applications via Redis messaging system automatically on service start.
-   "globalData" also works as "Single source of truth".
-   Multiple "globalData" microservices can only be synchronized copy for load ballancing.
-   Other microservices might be sharded to multiple servers by setting "mainId" of currently used service to write to.

Then all microservices and applications can communicate with each other via "microserviceCall" and "appCall" methods in "/digitalniweb-custom/helpers/remoteProcedureCall.ts" respectively. These are intentioned to be ran on server side only.

Every microservice and application needs submodules https://github.com/digitalniweb/digitalniweb-types and https://github.com/digitalniweb/digitalniweb-custom

## Microservices

### GlobalData

You need to run seeders to work properly because we need initial languages, currencies, modules, widgets etc.

### Websites

#### modules

Are self contained components or functionalities like 'articles', 'products', 'blog posts', 'news', etc.

Modules might be premium i.e. paid for.

Different Applications might have different modules.

**Modules might be:**

1. Modules like 'Articles' and 'Products' have their own menus

2. Modules like 'BlogPosts' and 'News' on the other hand have list pagination of all posts

3. There might be other modules with simple or complex functionalities - Eshop (multiple tables and functionalities)

If modules have their own dedicated root url ('/news' in '/news/we-started-new-website') their default values are specified in ["ModulesPagesLanguage"](digitalniweb-types/models/globalData.d.ts#ModulesPagesLanguage) for every Language. These values might be shown on the root page or other pages as well (depends on the individual module). (To implement maybe - user will be able to change these default values in 'content ms' for every website)

#### widgets

Are smaller components inside modules like text, banner, etc.

## Applications

-   see https://github.com/digitalniweb/saas

# Other information

## Installation

use `git clone  --recurse-submodules https://github.com/digitalniweb/microservices.git .` to create a new repository in current folder with submodules

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
