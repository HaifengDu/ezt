import { ERequestType } from "../enum/ERequestType";
import { IUser } from "../interface/IUserModel";
declare var process:any;
export class BaseService{
    private static readonly typeDict={
        [ERequestType.AppOrder]:process.reqUrl.appOrder,
        [ERequestType.Extension]:process.reqUrl.extension,
        [ERequestType.Payment]:process.reqUrl.payment,
        [ERequestType.Boh]:process.reqUrl.boh,
    }
    protected reqUrl = "";
    constructor(type:ERequestType) {
        this.reqUrl = BaseService.typeDict[type];
    }

    protected setType(type:ERequestType){
        this.reqUrl = BaseService.typeDict[type];
    }
}