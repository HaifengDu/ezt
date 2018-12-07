import { AxiosPromise } from 'axios';
import { IPagerData } from '../IPagerData';

export interface ISpilledSheetService{
    getGoodResult?:(pager:IPagerData)=>AxiosPromise<any>;
    getGoodDetail():AxiosPromise<any>;
    getGoodList(status:string,pager:IPagerData):AxiosPromise<any>;
}