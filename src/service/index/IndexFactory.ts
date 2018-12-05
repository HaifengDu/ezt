import store from "../store"
import BOHIndexService from "./BOHIndexService";
import IndexService from "./IndexService";
import { IIndexService } from "../../interface/service/IIndexService";
export class IndexFactory {
         private static _instance: IndexFactory;

         private constructor() {}

         public createService(): IIndexService {
           const isBOH = store.getters.InterfaceSysTypeBOH;
           if (isBOH) {
             return BOHLoginService.getInstance();
           }
           return LoginService.getInstance();
         }

         static createInstance() {
           IndexFactory.getInstance();
         }

         static getInstance() {
           return this._instance || (this._instance = new this());
         }
       }

export default IndexFactory;