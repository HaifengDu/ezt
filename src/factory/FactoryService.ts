import store from "../store";
import { IFactory } from "../interface/IFactory";
import { BOHFactroyService } from "./BOHFactory";
import { SaasFactroyService } from "./SaasFactroyService";

export class FactoryService {

    private static _instance: FactoryService;

    private constructor() {
    }

    createFactory(): IFactory{
        const isBOH = store.getters.InterfaceSysTypeBOH;
        if(isBOH){
            return BOHFactroyService.getInstance();
        }
        return SaasFactroyService.getInstance();
    }

    static createInstance() {
        FactoryService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}