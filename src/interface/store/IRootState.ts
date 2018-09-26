import { IUser } from "../IUserModel";

export interface IRootState{
    user?:IUser,
    systemParamSetting?:object
}
export default IRootState;