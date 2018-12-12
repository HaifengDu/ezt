import {AxiosPromise} from 'Axios';
import { IPagerData } from '../IPagerData';

export interface IReceiveGoodService{
    getGoodList(receiveType:string,auditStatus:string,pager:IPagerData):AxiosPromise<any>;
    checkWarehouse?:() => AxiosPromise<any>;
    getGoodDetail(receiveType:string,id:string,pager:IPagerData):AxiosPromise<any>;
}  