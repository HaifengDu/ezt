import {AxiosPromise} from 'Axios';
import { IPagerData } from '../IPagerData';

export interface IReceiveGoodService{
    getGoodList(status:string,pager:IPagerData):AxiosPromise<any>;
    checkWarehouse?:() => AxiosPromise<any>;
    getGoodDetail(id:string,type:string):AxiosPromise<any>;
}