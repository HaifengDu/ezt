import { Action } from "vuex";
import IRootState from "../interface/store/IRootState";
import RootType from "./mutation-types";
import { IUser } from "../interface/IUserModel";

export const updateUser:Action<IRootState,IRootState> = ({commit},user:IUser)=>{
    commit(RootType.UPDATE_USER, user);
};
export const setSystemParam:Action<IRootState,IRootState> = ({commit},systemParamSetting:object)=>{
    commit(RootType.SET_SYSTEMPARAM, systemParamSetting);
};
export const setInterfaceSysTypeBOH:Action<IRootState,IRootState> = ({commit},InterfaceSysTypeBOH:Boolean) =>{
    commit(RootType.SET_INTERFACESYSTYPEBOH,InterfaceSysTypeBOH);
};
export const setMaterialSetting:Action<IRootState,IRootState> = ({commit},materialSetting:object) =>{
    commit(RootType.SET_MATERIALSETTING,materialSetting);
};
