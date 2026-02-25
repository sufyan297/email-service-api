import { DataSource as TypeORMDataSource } from "typeorm";
import Admin from "../src/models/Admin";
import Campaign from "../src/models/Campaign";
import CampaignList from "../src/models/CampaignList";
import DeliveryLog from "../src/models/DeliveryLog";
import List from "../src/models/List";
import MailQueue from "../src/models/MailQueue";
import SMTP from "../src/models/SMTP";
import Subscriber from "../src/models/Subscriber";
import SubscriberList from "../src/models/SubscribersList";
import Template from "../src/models/Template";

export const AppDataSource = new TypeORMDataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE_NAME,
  logging: true,
  synchronize: true,
  entities: [
    Admin,
    Campaign,
    CampaignList,
    DeliveryLog,
    List,
    MailQueue,
    SMTP,
    Subscriber,
    SubscriberList,
    Template,
  ],
});

export default class DataSource {
  static async init() {
    console.log("Initializing Database Connection...");
    return AppDataSource.initialize()
      .then((data) => {
        let { username, password, ...rest } = data.options as any;
        console.log("Database Connected:", rest);
        return true;
      })
      .catch((err) => {
        console.error("[Error Connecting To Database] :", err);
        throw err;
      });
  }
}
