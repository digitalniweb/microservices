# Migrations

- [documentation](https://https://sequelize.org/docs/v6/other-topics/migrations/)

Migrations have dedicated table in database unlike seeders

## Up

    npx sequelize-cli db:migrate

## Down

revert the most recent migration (from DB):

    npx sequelize-cli db:migrate:undo

revert all:

    npx sequelize-cli db:migrate:undo:all

# Seeders

- [documentation](https://https://sequelize.org/docs/v6/other-topics/migrations/)

## Up

    npx sequelize-cli db:seed:all

## Down

revert the most recent seeder (only last file via date name):

    npx sequelize-cli db:seed:undo

revert specific seed:

    npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data

revert all:

    npx sequelize-cli db:seed:undo:all
