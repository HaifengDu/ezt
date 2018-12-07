import { AxiosPromise } from 'axios';
import { IPagerData } from '../IPagerData';

export interface ILeadbackMaterialService{
    getGoodResult?:(pager:IPagerData)=>AxiosPromise<any>;
    getGoodDetail():AxiosPromise<any>;
    getGoodList(status:string,pager:IPagerData):AxiosPromise<any>;
}