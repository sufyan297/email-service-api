import { DataSource as TypeORMDataSource } from "typeorm";
import Campaign from "../src/models/Campaign";
import CampaignList from "../src/models/CampaignList";
import CampaignMedia from "../src/models/CampaignMedia";
import CampaignView from "../src/models/CampaignView";
import List from "../src/models/List";
import Subscriber from "../src/models/Subscriber";
import SubscriberList from "../src/models/SubscriberList";
import Template from "../src/models/Template";
import Bounce from "../src/models/Bounce";
import Media from "../src/models/Media";
import Link from "../src/models/Link";
import LinkClick from "../src/models/LinkClick";
import SMTPConfig from "../src/models/SMTPConfig";
import Setting from "../src/models/Setting";
import ImportJob from "../src/models/ImportJob";
import ImportLog from "../src/models/ImportLog";
import User from "../src/models/User";
import Session from "../src/models/Session";

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
    Bounce,
    Campaign,
    CampaignList,
    CampaignMedia,
    CampaignView,
    ImportJob,
    ImportLog,
    Link,
    LinkClick,
    List,
    Media,
    Session,
    Setting,
    SMTPConfig,
    Subscriber,
    SubscriberList,
    Template,
    User,
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
