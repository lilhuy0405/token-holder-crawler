import "reflect-metadata"
import { DataSource } from "typeorm"
import TokenBalance from "./entity/TokenBalance";
import TotalHolder from "./entity/TotalHolder";
import TopDapp from "./entity/TopDapp";
import Transaction from "./entity/Transaction";


export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [TokenBalance, TotalHolder, TopDapp, Transaction],
    subscribers: [],
})
