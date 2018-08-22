export interface IUser{
    auth?:{
        [index:string]:any
    }
    store_id?:number;
    /**
     * 商户名
     */
    shopname?:string;
    /**
     * 登录名
     */
    loginname?:string;
    /**
     * 用户名
     */
    username?:string;
    /**
     * 密码
     */
    pwd?:string;
    /**
     * 加密后的密码
     */
    encrypwd?:string;
}
export default IUser;