import { AppInstance } from "..";
import { AdminController } from "./controller/adminController";
import { GlobalResponseHandler } from "./GlobalResponseHandler";



export const Router = (app: AppInstance) => {
  
  //intercepts all response
  GlobalResponseHandler(app);

  AdminController(app);

}