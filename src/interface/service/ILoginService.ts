import { AxiosPromise } from "axios"
import IUser from "../IUserModel";

export interface ILoginService{
    login(user:IUser):AxiosPromise<any>;
    autoLogin():AxiosPromise<any>;
    logout():AxiosPromise<any>;
    modifyPassword?: (oldPasswd:string,newPasswd:string) => AxiosPromise<any>;
    getPersonal():AxiosPromise<any>;//获取个人信息
}