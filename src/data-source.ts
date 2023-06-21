import "reflect-metadata"
import { DataSource } from "typeorm"
import { UsersEntity } from "./entities/Users"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "islom_01",
    database: "rabbit_db",
    synchronize: true,
    logging: false,
    entities: [UsersEntity],
    migrations: [],
    subscribers: [],
})
