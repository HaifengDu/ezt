import {AxiosPromise} from 'Axios';
import { IPagerData } from '../IPagerData';

export interface IReceiveGoodService{
    getGoodList(param:any,pager:IPagerData):AxiosPromise<any>;
    checkWarehouse?:() => AxiosPromise<any>;
    getGoodDetail(id:string,pager:IPagerData):AxiosPromise<any>;
}
