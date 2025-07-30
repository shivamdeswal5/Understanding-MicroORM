# Migration Commands
1. Create Migration
    docker exec -it mikro-orm-crud npm run migration:create InitialMigration

// "migration:create": "npm run mikro-orm -- migration:create --config ./dist/infrastructure/database/config/mikro-orm.config.ts"

docker exec -it mikro-orm-crud npx mikro-orm migration:up --config dist/src/infrastructure/database/config/mikro-orm.config.js