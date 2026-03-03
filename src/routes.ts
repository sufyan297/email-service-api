import { AppInstance } from "..";
import { AuthController } from "./controller/authController";
import { BounceController } from "./controller/bounceController";
import { CampaignController } from "./controller/campaignController";
import { ImportController } from "./controller/importController";
import { ListController } from "./controller/listController";
import { MediaController } from "./controller/mediaController";
import { PublicController } from "./controller/publicController";
import { SettingsController } from "./controller/settingsController";
import { SMTPController } from "./controller/smtpController";
import { SubscriberController } from "./controller/subscriberController";
import { SystemController } from "./controller/systemController";
import { TemplateController } from "./controller/templateController";
import { TransactionalController } from "./controller/transactionalController";
import { UserController } from "./controller/userController";
import { GlobalResponseHandler } from "./GlobalResponseHandler";

export const Router = (app: AppInstance) => {
  //intercepts all response
  GlobalResponseHandler(app);

  AuthController(app);
  BounceController(app);
  CampaignController(app);
  ImportController(app);
  ListController(app);
  MediaController(app);
  PublicController(app);
  SettingsController(app);
  SMTPController(app);
  SubscriberController(app);
  SystemController(app);
  TemplateController(app);
  TransactionalController(app);
  UserController(app);
};
