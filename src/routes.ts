import { AppInstance } from "..";
import { AdminController } from "./controller/adminController";
import { BounceController } from "./controller/bounceController";
import { CampaignController } from "./controller/campaignController";
import { ImportController } from "./controller/importController";
import { ListController } from "./controller/listController";
import { MediaController } from "./controller/mediaController";
import { PublicController } from "./controller/publicController";
import { SubscriberController } from "./controller/subscriberController";
import { TemplateController } from "./controller/templateController";
import { TransactionalController } from "./controller/transactionalController";
import { GlobalResponseHandler } from "./GlobalResponseHandler";

export const Router = (app: AppInstance) => {
  //intercepts all response
  GlobalResponseHandler(app);

  AdminController(app);
  BounceController(app);
  CampaignController(app);
  ImportController(app);
  ListController(app);
  MediaController(app);
  PublicController(app);
  SubscriberController(app);
  TemplateController(app);
  TransactionalController(app);
};
