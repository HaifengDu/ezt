import { IUser } from "../IUserModel";

export interface IRootState{
    user?:IUser,
    systemParamSetting?:object,
    InterfaceSysTypeBOH?:Boolean,//区分后台接口为BOH还是SAAS
    materialSetting?:object,//物料参数设置
}
export default IRootState;