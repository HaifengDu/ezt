import { IUser } from "../IUserModel";

export interface IRootState{
    user?:IUser,
    systemParamSetting?:object,
    logistics?:object,//物流设置
}
export default IRootState;