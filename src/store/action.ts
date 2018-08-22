import { Action } from "vuex";
import IRootState from "../interface/store/IRootState";
import RootType from "./mutation-types";
import { IUser } from "../interface/IUserModel";

export const updateUser:Action<IRootState,IRootState> = ({commit},user:IUser)=>{
    commit(RootType.UPDATE_USER, user);
};